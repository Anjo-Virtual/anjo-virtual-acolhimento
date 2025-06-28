
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { message, conversationId, userId, leadData } = await req.json()
    
    if (!message || !userId) {
      throw new Error('Mensagem e userId são obrigatórios')
    }

    console.log(`[CHAT-RAG] Iniciando chat para usuário ${userId}`)

    let conversation = null

    // Se não tiver conversationId, criar nova conversa
    if (!conversationId) {
      console.log('[CHAT-RAG] Criando nova conversa')
      
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
        throw new Error('Erro ao criar conversa: ' + convError.message)
      }
      
      conversation = newConversation
      
      // Se temos dados de lead, criar registro de lead
      if (leadData && leadData.name && leadData.email) {
        console.log('[CHAT-RAG] Salvando dados do lead')
        
        const { data: chatLead, error: leadError } = await supabaseClient
          .from('chat_leads')
          .insert({
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone || null,
            conversation_id: conversation.id,
            metadata: {
              source: 'chat_modal',
              first_message: message.substring(0, 100),
              user_agent: req.headers.get('user-agent') || 'unknown'
            }
          })
          .select()
          .single()

        if (leadError) {
          console.error('[CHAT-RAG] Erro ao salvar lead:', leadError)
        } else {
          // Atualizar conversa com o lead_id
          await supabaseClient
            .from('conversations')
            .update({ lead_id: chatLead.id })
            .eq('id', conversation.id)
          
          console.log(`[CHAT-RAG] Lead capturado: ${chatLead.id}`)
        }
      }
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
      console.error('[CHAT-RAG] Erro ao salvar mensagem do usuário:', userMsgError)
    }

    // Buscar chunks relevantes usando a função melhorada
    console.log('[CHAT-RAG] Buscando conhecimento relevante')
    
    const { data: relevantChunks, error: searchError } = await supabaseClient
      .rpc('search_knowledge_base', {
        search_query: message,
        limit_results: 5
      })

    if (searchError) {
      console.error('[CHAT-RAG] Erro na busca:', searchError)
    }

    console.log(`[CHAT-RAG] Encontrados ${relevantChunks?.length || 0} chunks relevantes`)

    // Buscar configuração do agente
    const { data: agentConfig, error: configError } = await supabaseClient
      .from('agent_configs')
      .select('*')
      .eq('active', true)
      .single()

    if (configError) {
      console.error('[CHAT-RAG] Erro ao buscar configuração do agente:', configError)
    }

    // Construir contexto melhorado para o GPT
    let context = agentConfig?.system_prompt || `Você é um assistente especializado em acolhimento emocional. 
    Sua função é oferecer suporte, orientação e informações úteis de forma empática e acolhedora.
    Sempre mantenha um tom respeitoso, compreensivo e humanizado em suas respostas.`
    
    if (relevantChunks && relevantChunks.length > 0) {
      context += '\n\n=== INFORMAÇÕES DA BASE DE CONHECIMENTO ===\n'
      relevantChunks.forEach((chunk, index) => {
        context += `\n[Fonte ${index + 1}: ${chunk.document_name}]\n`
        context += `Resumo: ${chunk.chunk_summary || 'Conteúdo sobre acolhimento'}\n`
        context += `Conteúdo: ${chunk.chunk_text}\n`
        context += `Relevância: ${(chunk.similarity_score * 100).toFixed(1)}%\n`
      })
      context += '\n=== FIM DAS INFORMAÇÕES ===\n'
      context += '\n\nUse essas informações para fornecer respostas precisas e fundamentadas. Sempre cite as fontes quando utilizar informações específicas da base de conhecimento.'
    }

    // Gerar resposta com OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    let assistantResponse = ''
    let sources = []

    if (openaiApiKey) {
      console.log('[CHAT-RAG] Gerando resposta com OpenAI')
      
      try {
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
          const errorData = await openaiResponse.text()
          throw new Error(`OpenAI API Error: ${errorData}`)
        }

        const openaiData = await openaiResponse.json()
        assistantResponse = openaiData.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta adequada.'
        
      } catch (error) {
        console.error('[CHAT-RAG] Erro na API OpenAI:', error)
        assistantResponse = 'Desculpe, estou enfrentando dificuldades técnicas no momento. Tente novamente em alguns instantes.'
      }
      
      // Preparar fontes utilizadas
      if (relevantChunks && relevantChunks.length > 0) {
        sources = relevantChunks.map(chunk => ({
          documentName: chunk.document_name || 'Documento',
          documentId: chunk.document_id,
          chunkText: chunk.chunk_text.substring(0, 200) + '...',
          summary: chunk.chunk_summary,
          relevanceScore: Math.round(chunk.similarity_score * 100)
        }))
      }
    } else {
      console.log('[CHAT-RAG] Usando resposta simulada (sem OpenAI API Key)')
      
      assistantResponse = `Compreendo sua mensagem: "${message}". ` +
        `Como assistente de acolhimento, estou aqui para oferecer suporte emocional personalizado. `
      
      if (relevantChunks && relevantChunks.length > 0) {
        assistantResponse += `\n\nBaseado nas informações da nossa base de conhecimento, posso compartilhar algumas orientações relevantes:\n\n`
        
        relevantChunks.slice(0, 2).forEach((chunk, index) => {
          assistantResponse += `${index + 1}. ${chunk.chunk_summary || 'Informação sobre acolhimento'}\n`
        })
        
        sources = relevantChunks.map(chunk => ({
          documentName: chunk.document_name || 'Documento',
          documentId: chunk.document_id,
          chunkText: chunk.chunk_text.substring(0, 200) + '...',
          summary: chunk.chunk_summary,
          relevanceScore: Math.round(chunk.similarity_score * 100)
        }))
      } else {
        assistantResponse += `\n\nEmbora não tenha encontrado informações específicas em nossa base de conhecimento para sua consulta, posso oferecer suporte geral e orientações baseadas em boas práticas de acolhimento.`
      }
    }

    // Salvar resposta do assistente
    const { error: assistantMsgError } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: assistantResponse,
        sources: sources,
        metadata: {
          chunks_used: relevantChunks?.length || 0,
          model_used: agentConfig?.model || 'gpt-4o-mini',
          has_api_key: !!openaiApiKey
        }
      })

    if (assistantMsgError) {
      console.error('[CHAT-RAG] Erro ao salvar resposta do assistente:', assistantMsgError)
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
      console.error('[CHAT-RAG] Erro ao atualizar conversa:', updateConvError)
    }

    console.log(`[CHAT-RAG] Chat concluído para conversa ${conversation.id}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        conversationId: conversation.id,
        response: assistantResponse,
        sources: sources,
        chunks_found: relevantChunks?.length || 0,
        lead_captured: !!(leadData && leadData.name && leadData.email)
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error('[CHAT-RAG] Erro no chat RAG:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor',
        details: 'Verifique os logs da função para mais detalhes'
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
