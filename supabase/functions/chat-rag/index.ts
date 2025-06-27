
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

    const { message, conversationId, userId } = await req.json()
    
    if (!message || !userId) {
      throw new Error('Mensagem e userId são obrigatórios')
    }

    let conversation = null

    // Se não tiver conversationId, criar nova conversa
    if (!conversationId) {
      const { data: newConversation, error: convError } = await supabaseClient
        .from('conversations')
        .insert({
          user_id: userId,
          title: message.substring(0, 50) + '...',
          message_count: 0
        })
        .select()
        .single()

      if (convError) {
        throw new Error('Erro ao criar conversa')
      }
      
      conversation = newConversation
    } else {
      // Buscar conversa existente
      const { data: existingConv, error: fetchError } = await supabaseClient
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()

      if (fetchError) {
        throw new Error('Conversa não encontrada')
      }

      conversation = existingConv
    }

    // Salvar mensagem do usuário
    const { error: userMsgError } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message
      })

    if (userMsgError) {
      console.error('Erro ao salvar mensagem do usuário:', userMsgError)
    }

    // Buscar chunks relevantes na base de conhecimento
    const { data: relevantChunks, error: searchError } = await supabaseClient
      .from('knowledge_base')
      .select(`
        *,
        documents (
          name,
          file_path
        )
      `)
      .textSearch('chunk_text', message)
      .limit(5)

    console.log('Chunks encontrados:', relevantChunks?.length || 0)

    // Buscar configuração do agente
    const { data: agentConfig, error: configError } = await supabaseClient
      .from('agent_configs')
      .select('*')
      .eq('active', true)
      .single()

    if (configError) {
      console.error('Erro ao buscar configuração do agente:', configError)
    }

    // Construir contexto para o GPT
    let context = agentConfig?.system_prompt || 'Você é um assistente útil.'
    
    if (relevantChunks && relevantChunks.length > 0) {
      context += '\n\nInformações relevantes da base de conhecimento:\n'
      relevantChunks.forEach((chunk, index) => {
        context += `\n[Fonte ${index + 1}: ${chunk.documents?.name || 'Documento'}]\n${chunk.chunk_text}\n`
      })
      context += '\n\nUse essas informações para responder de forma precisa e cite as fontes quando relevante.'
    }

    // Simular resposta da OpenAI (em produção, usar API real)
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    let assistantResponse = ''
    let sources = []

    if (openaiApiKey) {
      // Fazer chamada real para OpenAI
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: agentConfig?.model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: context },
            { role: 'user', content: message }
          ],
          temperature: agentConfig?.temperature || 0.7,
          max_tokens: agentConfig?.max_tokens || 1000,
        }),
      })

      if (!openaiResponse.ok) {
        throw new Error('Erro na API da OpenAI')
      }

      const openaiData = await openaiResponse.json()
      assistantResponse = openaiData.choices[0]?.message?.content || 'Erro ao gerar resposta'
      
      // Extrair fontes utilizadas
      if (relevantChunks && relevantChunks.length > 0) {
        sources = relevantChunks.map(chunk => ({
          documentName: chunk.documents?.name || 'Documento',
          documentId: chunk.document_id,
          chunkText: chunk.chunk_text.substring(0, 200) + '...'
        }))
      }
    } else {
      // Resposta simulada se não tiver API key
      assistantResponse = `Entendo sua pergunta: "${message}". ` +
        `Como assistente de acolhimento, estou aqui para oferecer suporte emocional. ` +
        (relevantChunks && relevantChunks.length > 0 
          ? `Encontrei ${relevantChunks.length} informações relevantes em nossa base de conhecimento que podem ajudar.`
          : 'Embora não tenha encontrado informações específicas, posso oferecer suporte geral.')
      
      if (relevantChunks && relevantChunks.length > 0) {
        sources = relevantChunks.map(chunk => ({
          documentName: chunk.documents?.name || 'Documento',
          documentId: chunk.document_id,
          chunkText: chunk.chunk_text.substring(0, 200) + '...'
        }))
      }
    }

    // Salvar resposta do assistente
    const { error: assistantMsgError } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: assistantResponse,
        sources: sources
      })

    if (assistantMsgError) {
      console.error('Erro ao salvar resposta do assistente:', assistantMsgError)
    }

    // Atualizar contador de mensagens na conversa
    const { error: updateConvError } = await supabaseClient
      .from('conversations')
      .update({ 
        message_count: conversation.message_count + 2,
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversation.id)

    if (updateConvError) {
      console.error('Erro ao atualizar conversa:', updateConvError)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        conversationId: conversation.id,
        response: assistantResponse,
        sources: sources
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error('Erro no chat RAG:', error)
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
