
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
    console.log('🔧 [CHAT-RAG] Inicializando função...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ [CHAT-RAG] Variáveis de ambiente não configuradas');
      throw new Error('Configuração do servidor incompleta');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('✅ [CHAT-RAG] Cliente Supabase criado');

    const requestBody = await req.json().catch(err => {
      console.error('❌ [CHAT-RAG] Erro ao ler body da requisição:', err);
      throw new Error('Formato de requisição inválido');
    });

    const { message, conversationId, userId, sessionId, leadData, userProfile } = requestBody;
    
    console.log('📝 [CHAT-RAG] Dados recebidos:', {
      messageLength: message?.length || 0,
      conversationId: conversationId || 'novo',
      userId: userId || 'anônimo',
      sessionId: sessionId || 'sem sessão',
      hasLeadData: !!leadData,
      hasUserProfile: !!userProfile,
      userName: userProfile?.display_name || 'Não informado'
    });
    
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw new Error('Mensagem é obrigatória e deve ser um texto válido');
    }

    // Para usuários anônimos, usar sessionId
    if (!userId && !sessionId) {
      throw new Error('userId ou sessionId são obrigatórios');
    }

    console.log(`🚀 [CHAT-RAG] Iniciando processamento para ${userId ? `usuário ${userId}` : `sessão ${sessionId}`}`);

    let conversation = null
    
    // Usar perfil passado pelo frontend ou buscar no banco se necessário
    let effectiveUserProfile = userProfile
    if (userId && !effectiveUserProfile) {
      console.log('[CHAT-RAG] Buscando perfil do usuário no banco:', userId)
      const { data: profile, error: profileError } = await supabaseClient
        .from('community_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError) {
        console.log('[CHAT-RAG] Perfil não encontrado ou erro:', profileError.message)
      } else {
        effectiveUserProfile = profile
        console.log('[CHAT-RAG] Perfil encontrado no banco:', profile.display_name)
      }
    } else if (effectiveUserProfile) {
      console.log('[CHAT-RAG] Usando perfil do frontend:', effectiveUserProfile.display_name)
    }

    // Se não tiver conversationId, criar nova conversa
    if (!conversationId) {
      console.log('[CHAT-RAG] Criando nova conversa')
      
      // Gerar título mais inteligente baseado no perfil e mensagem
      let conversationTitle = message.substring(0, 50) + '...'
      if (effectiveUserProfile) {
        conversationTitle = `Conversa com ${effectiveUserProfile.display_name}`
      }
      
      const conversationData = {
        title: conversationTitle,
        message_count: 0,
        ...(userId ? { user_id: userId } : { session_id: sessionId })
      }
      
      const { data: newConversation, error: convError } = await supabaseClient
        .from('conversations')
        .insert(conversationData)
        .select()
        .single()

      if (convError) {
        throw new Error('Erro ao criar conversa: ' + convError.message)
      }
      
      conversation = newConversation
      
      // NOVO: Captura automática de lead para usuários logados
      if (userId && effectiveUserProfile) {
        console.log('[CHAT-RAG] Verificando lead automático para usuário logado')
        
        // Verificar se já existe lead para este usuário
        const { data: existingLead, error: leadCheckError } = await supabaseClient
          .from('chat_leads')
          .select('*')
          .eq('email', effectiveUserProfile.user_id + '@user.local') // Email temporário baseado no user_id
          .single()

        if (leadCheckError && leadCheckError.code !== 'PGRST116') { // PGRST116 = not found
          console.error('[CHAT-RAG] Erro ao verificar lead existente:', leadCheckError)
        }

        if (!existingLead) {
          // Criar lead automático para usuário logado
          console.log('[CHAT-RAG] Criando lead automático para usuário logado')
          
          const { data: autoLead, error: autoLeadError } = await supabaseClient
            .from('chat_leads')
            .insert({
              name: effectiveUserProfile.display_name,
              email: effectiveUserProfile.user_id + '@user.local', // Email temporário
              phone: null,
              conversation_id: conversation.id,
              metadata: {
                source: 'auto_capture',
                type: 'logged_user',
                user_id: userId,
                first_message: message.substring(0, 100),
                user_agent: req.headers.get('user-agent') || 'unknown',
                grief_type: effectiveUserProfile.grief_type || null
              }
            })
            .select()
            .single()

          if (autoLeadError) {
            console.error('[CHAT-RAG] Erro ao criar lead automático:', autoLeadError)
          } else {
            // Atualizar conversa com o lead_id
            await supabaseClient
              .from('conversations')
              .update({ lead_id: autoLead.id })
              .eq('id', conversation.id)
            
            console.log(`[CHAT-RAG] Lead automático capturado: ${autoLead.id}`)
          }
        } else {
          // Lead já existe, apenas conectar à conversa
          await supabaseClient
            .from('conversations')
            .update({ lead_id: existingLead.id })
            .eq('id', conversation.id)
          
          console.log(`[CHAT-RAG] Conversa conectada ao lead existente: ${existingLead.id}`)
        }
      }
      
      // Se temos dados de lead explícitos, criar registro de lead
      if (leadData && leadData.name && leadData.email) {
        console.log('[CHAT-RAG] Salvando dados do lead explícito')
        
        // Verificar duplicação por email
        const { data: existingEmailLead, error: emailCheckError } = await supabaseClient
          .from('chat_leads')
          .select('*')
          .eq('email', leadData.email)
          .single()

        if (emailCheckError && emailCheckError.code !== 'PGRST116') {
          console.error('[CHAT-RAG] Erro ao verificar lead por email:', emailCheckError)
        }

        if (!existingEmailLead) {
          const { data: chatLead, error: leadError } = await supabaseClient
            .from('chat_leads')
            .insert({
              name: leadData.name,
              email: leadData.email,
              phone: leadData.phone || null,
              conversation_id: conversation.id,
              metadata: {
                source: 'chat_modal',
                type: 'explicit_capture',
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
            
            console.log(`[CHAT-RAG] Lead explícito capturado: ${chatLead.id}`)
          }
        } else {
          // Lead já existe, conectar à conversa
          await supabaseClient
            .from('conversations')
            .update({ lead_id: existingEmailLead.id })
            .eq('id', conversation.id)
          
          console.log(`[CHAT-RAG] Conversa conectada ao lead existente: ${existingEmailLead.id}`)
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

    // NOVO: Buscar histórico de mensagens para contexto
    console.log('[CHAT-RAG] Buscando histórico de mensagens')
    const { data: messageHistory, error: historyError } = await supabaseClient
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(10) // Últimas 10 mensagens para contexto

    if (historyError) {
      console.error('[CHAT-RAG] Erro ao buscar histórico:', historyError)
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

    // Construir contexto melhorado para o GPT COM HISTÓRICO E PERFIL
    let context = agentConfig?.system_prompt || `Você é um assistente especializado em acolhimento emocional. 
    Sua função é oferecer suporte, orientação e informações úteis de forma empática e acolhedora.
    Sempre mantenha um tom respeitoso, compreensivo e humanizado em suas respostas.`
    
    // NOVO: Adicionar informações do perfil do usuário ao contexto
    if (effectiveUserProfile) {
      context += '\n\n=== INFORMAÇÕES DO USUÁRIO ===\n'
      context += `Nome: ${effectiveUserProfile.display_name}\n`
      if (effectiveUserProfile.bio) {
        context += `Bio: ${effectiveUserProfile.bio}\n`
      }
      if (effectiveUserProfile.grief_type) {
        context += `Tipo de luto: ${effectiveUserProfile.grief_type}\n`
      }
      context += `Usuário anônimo: ${effectiveUserProfile.is_anonymous ? 'Sim' : 'Não'}\n`
      context += '=== FIM DAS INFORMAÇÕES DO USUÁRIO ===\n'
      context += `\nUse essas informações para personalizar suas respostas. Se o usuário preferir anonimato, seja discreto. Adapte seu tom baseado no tipo de luto quando mencionado. Chame o usuário pelo nome quando apropriado.\n`
    }
    
    // NOVO: Adicionar histórico de mensagens ao contexto
    if (messageHistory && messageHistory.length > 0) {
      context += '\n\n=== HISTÓRICO DA CONVERSA ===\n'
      messageHistory.forEach((msg, index) => {
        const role = msg.role === 'user' ? 'Usuário' : 'Assistente'
        context += `${role}: ${msg.content}\n`
      })
      context += '=== FIM DO HISTÓRICO ===\n'
      context += '\nUse o histórico acima para manter a continuidade da conversa e lembrar-se do contexto anterior.\n'
    }
    
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
      console.log('[CHAT-RAG] Gerando resposta com OpenAI (com histórico)')
      
      try {
        // NOVO: Construir array de mensagens incluindo histórico
        const messages = [
          { role: 'system', content: context }
        ]
        
        // Adicionar histórico de mensagens
        if (messageHistory && messageHistory.length > 0) {
          messageHistory.forEach(msg => {
            messages.push({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            })
          })
        }
        
        // Adicionar mensagem atual
        messages.push({ role: 'user', content: message })

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: agentConfig?.model || 'gpt-4o-mini',
            messages: messages,
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
      
      // Mencionar continuidade se houver histórico
      if (messageHistory && messageHistory.length > 0) {
        assistantResponse += `\n\nLembro-me de nossa conversa anterior e posso continuar de onde paramos. `
      }
      
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
          has_api_key: !!openaiApiKey,
          has_history: !!(messageHistory && messageHistory.length > 0)
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

    console.log(`✅ [CHAT-RAG] Chat concluído para conversa ${conversation.id} ${messageHistory?.length ? 'com histórico' : 'sem histórico'}`);

    const successResponse = {
      success: true,
      conversationId: conversation.id,
      response: assistantResponse,
      sources: sources,
      chunks_found: relevantChunks?.length || 0,
      lead_captured: !!(leadData && leadData.name && leadData.email),
      has_history: !!(messageHistory && messageHistory.length > 0)
    };

    console.log('📤 [CHAT-RAG] Enviando resposta de sucesso:', {
      conversationId: successResponse.conversationId,
      responseLength: assistantResponse.length,
      sourcesCount: sources.length,
      chunks_found: successResponse.chunks_found
    });

    return new Response(
      JSON.stringify(successResponse),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )

  } catch (error) {
    console.error('💥 [CHAT-RAG] Erro crítico no chat RAG:', error);
    
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      details: 'Verifique os logs da função para mais detalhes',
      timestamp: new Date().toISOString()
    };

    console.log('📤 [CHAT-RAG] Enviando resposta de erro:', errorResponse);

    return new Response(
      JSON.stringify(errorResponse),
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
