
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { documentId } = await req.json()
    
    if (!documentId) {
      throw new Error('documentId é obrigatório')
    }

    // Buscar documento
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      throw new Error('Documento não encontrado')
    }

    // Baixar arquivo do storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('documents')
      .download(document.file_path)

    if (downloadError || !fileData) {
      throw new Error('Erro ao baixar arquivo')
    }

    // Simular extração de texto do PDF (em produção, usar biblioteca PDF)
    const text = await fileData.text()
    console.log('Texto extraído:', text.substring(0, 200))

    // Dividir texto em chunks
    const chunkSize = 1000
    const chunks = []
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize))
    }

    console.log(`Criando ${chunks.length} chunks para documento ${documentId}`)

    // Processar cada chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      
      // Criar embedding (simulado por enquanto - em produção usar OpenAI)
      const mockEmbedding = Array.from({length: 1536}, () => Math.random())
      
      // Salvar chunk na base de conhecimento
      const { error: chunkError } = await supabaseClient
        .from('knowledge_base')
        .insert({
          document_id: documentId,
          chunk_text: chunk,
          chunk_index: i,
          embedding_data: JSON.stringify(mockEmbedding),
          metadata: {
            start_char: i * chunkSize,
            end_char: Math.min((i + 1) * chunkSize, text.length)
          }
        })

      if (chunkError) {
        console.error('Erro ao salvar chunk:', chunkError)
      }
    }

    // Marcar documento como processado
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ 
        processed: true, 
        chunk_count: chunks.length 
      })
      .eq('id', documentId)

    if (updateError) {
      console.error('Erro ao atualizar documento:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        chunks: chunks.length,
        message: 'Documento processado com sucesso'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error('Erro no processamento:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor' 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )
  }
})
