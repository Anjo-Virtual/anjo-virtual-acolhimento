
-- Criar tabela para armazenar documentos
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  chunk_count INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para base de conhecimento (chunks dos documentos)
-- Usando TEXT para embedding por enquanto, depois migraremos para VECTOR
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding_data TEXT, -- Armazenar embedding como JSON string temporariamente
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para conversas
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}'
);

-- Criar tabela para mensagens
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]', -- Para citações de documentos
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para configurações do agente
CREATE TABLE public.agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 1),
  max_tokens INTEGER DEFAULT 1000,
  model TEXT DEFAULT 'gpt-4o-mini',
  active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar bucket de storage para PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_configs ENABLE ROW LEVEL SECURITY;

-- Políticas para documents (apenas admins podem gerenciar)
CREATE POLICY "Admins can manage documents" ON public.documents
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para knowledge_base (apenas admins podem gerenciar)
CREATE POLICY "Admins can manage knowledge base" ON public.knowledge_base
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para conversations (usuários podem ver suas próprias conversas, admins veem todas)
CREATE POLICY "Users can manage their conversations" ON public.conversations
  FOR ALL USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Políticas para messages (usuários podem ver mensagens de suas conversas, admins veem todas)
CREATE POLICY "Users can manage messages in their conversations" ON public.messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id 
      AND (user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

-- Políticas para agent_configs (apenas admins podem gerenciar)
CREATE POLICY "Admins can manage agent configs" ON public.agent_configs
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para storage bucket documents
CREATE POLICY "Admins can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND public.is_admin(auth.uid()));

-- Triggers para updated_at (reutilizando função existente)
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_configs_updated_at BEFORE UPDATE ON public.agent_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir configuração padrão do agente
INSERT INTO public.agent_configs (name, system_prompt, temperature, max_tokens, model)
VALUES (
  'Agente de Acolhimento',
  'Você é um assistente especializado em acolhimento e suporte emocional para pessoas em luto. 

Suas características:
- Empático e compassivo
- Oferece suporte baseado em evidências
- Cita fontes dos documentos quando relevante
- Mantém um tom acolhedor e respeitoso
- Evita conselhos médicos diretos

Quando responder:
1. Seja gentil e compreensivo
2. Use informações da base de conhecimento quando relevante
3. Cite as fontes dos documentos utilizados
4. Ofereça suporte emocional adequado
5. Sugira recursos adicionais quando apropriado',
  0.7,
  1000,
  'gpt-4o-mini'
);
