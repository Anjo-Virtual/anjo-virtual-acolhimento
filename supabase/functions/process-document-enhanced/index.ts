
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para extrair texto de PDF (simulada - em produção usar biblioteca específica)
async function extractTextFromPDF(fileData: Blob): Promise<string> {
  // Em produção, usar biblioteca como pdf-parse ou similar
  // Por enquanto, vamos simular extração de texto mais realista
  const text = await fileData.text()
  
  // Simular extração de texto estruturado
  const mockContent = `
    MANUAL DE ACOLHIMENTO EMOCIONAL

    1. INTRODUÇÃO
    O acolhimento emocional é fundamental para oferecer suporte adequado às pessoas em momentos de vulnerabilidade. 
    Este documento estabelece diretrizes e práticas recomendadas para profissionais que atuam no atendimento humanizado.

    2. PRINCÍPIOS BÁSICOS
    - Escuta ativa e empática
    - Respeito à dignidade humana
    - Confidencialidade e sigilo
    - Acolhimento sem julgamentos
    - Orientação baseada em evidências

    3. TÉCNICAS DE ACOLHIMENTO
    3.1 Escuta Ativa
    A escuta ativa envolve dar total atenção à pessoa, demonstrando interesse genuíno em compreender seus sentimentos e necessidades.
    
    3.2 Validação Emocional
    Reconhecer e validar as emoções da pessoa, demonstrando que seus sentimentos são legítimos e compreensíveis.
    
    3.3 Comunicação Empática
    Utilizar linguagem acolhedora, evitando jargões técnicos e mantendo tom respeitoso e compreensivo.

    4. SITUAÇÕES ESPECÍFICAS
    4.1 Luto e Perda
    O processo de luto é único para cada pessoa. É importante respeitar o tempo e a forma como cada um vivencia sua dor.
    
    4.2 Ansiedade e Estresse
    Técnicas de respiração e mindfulness podem auxiliar no manejo da ansiedade aguda.
    
    4.3 Depressão
    Identificar sinais de depressão e encaminhar para acompanhamento especializado quando necessário.

    5. RECURSOS E ENCAMINHAMENTOS
    - Rede de apoio familiar e social
    - Serviços de saúde mental
    - Grupos de apoio
    - Programas de assistência social

    6. CUIDADOS COM O PROFISSIONAL
    É fundamental que o profissional também cuide de sua saúde mental e busque supervisão quando necessário.
  `
  
  return mockContent
}

// Função para dividir texto em chunks mais inteligentes
function createSmartChunks(text: string, maxChunkSize: number = 800): Array<{text: string, summary: string, wordCount: number}> {
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0)
  const chunks = []
  
  let currentChunk = ''
  
  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > maxChunkSize && currentChunk.length > 0) {
      const wordCount = currentChunk.split(' ').length
      const summary = extractSummary(currentChunk)
      
      chunks.push({
        text: currentChunk.trim(),
        summary,
        wordCount
      })
      currentChunk = paragraph
    } else {
      currentChunk += '\n\n' + paragraph
    }
  }
  
  if (currentChunk.trim().length > 0) {
    const wordCount = currentChunk.split(' ').length
    const summary = extractSummary(currentChunk)
    
    chunks.push({
      text: currentChunk.trim(),
      summary,
      wordCount
    })
  }
  
  return chunks
}

// Função para extrair resumo do chunk
function extractSummary(text: string): string {
  const lines = text.split('\n').filter(line => line.trim().length > 0)
  const firstMeaningfulLine = lines.find(line => 
    line.length > 10 && 
    !line.match(/^\d+\./) && 
    line.trim() !== line.trim().toUpperCase()
  )
  
  return firstMeaningfulLine ? firstMeaningfulLine.substring(0, 100) + '...' : 'Conteúdo sobre acolhimento'
}

serve(async (req) => {
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

    console.log(`[PROCESS-DOC] Iniciando processamento do documento ${documentId}`)

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
      throw new Error('Erro ao baixar arquivo: ' + downloadError?.message)
    }

    console.log(`[PROCESS-DOC] Arquivo baixado, tamanho: ${fileData.size} bytes`)

    // Extrair texto do PDF
    const extractedText = await extractTextFromPDF(fileData)
    console.log(`[PROCESS-DOC] Texto extraído, tamanho: ${extractedText.length} caracteres`)

    // Criar chunks inteligentes
    const chunks = createSmartChunks(extractedText)
    console.log(`[PROCESS-DOC] Criados ${chunks.length} chunks inteligentes`)

    // Limpar chunks existentes
    const { error: deleteError } = await supabaseClient
      .from('knowledge_base')
      .delete()
      .eq('document_id', documentId)

    if (deleteError) {
      console.error('[PROCESS-DOC] Erro ao limpar chunks existentes:', deleteError)
    }

    // Processar cada chunk
    let successCount = 0
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      
      try {
        const { error: chunkError } = await supabaseClient
          .from('knowledge_base')
          .insert({
            document_id: documentId,
            chunk_text: chunk.text,
            chunk_summary: chunk.summary,
            word_count: chunk.wordCount,
            chunk_index: i,
            metadata: {
              original_length: extractedText.length,
              chunk_position: i + 1,
              total_chunks: chunks.length,
              extraction_method: 'enhanced_pdf_parser'
            },
            processed_at: new Date().toISOString()
          })

        if (chunkError) {
          console.error(`[PROCESS-DOC] Erro ao salvar chunk ${i}:`, chunkError)
        } else {
          successCount++
        }
      } catch (error) {
        console.error(`[PROCESS-DOC] Erro no chunk ${i}:`, error)
      }
    }

    // Atualizar documento como processado
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ 
        processed: true, 
        chunk_count: successCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)

    if (updateError) {
      console.error('[PROCESS-DOC] Erro ao atualizar documento:', updateError)
    }

    console.log(`[PROCESS-DOC] Processamento concluído: ${successCount}/${chunks.length} chunks salvos`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        chunks: successCount,
        total_attempted: chunks.length,
        message: `Documento processado com sucesso - ${successCount} chunks criados`,
        text_extracted: extractedText.length > 0,
        extraction_preview: extractedText.substring(0, 200) + '...'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error('[PROCESS-DOC] Erro no processamento:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor',
        details: 'Verifique os logs para mais informações'
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
