
-- Criar tabela para armazenar leads capturados do chat
CREATE TABLE public.chat_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar campo para link do lead na tabela conversations
ALTER TABLE public.conversations 
ADD COLUMN lead_id UUID REFERENCES public.chat_leads(id) ON DELETE SET NULL;

-- Melhorar tabela knowledge_base para busca mais eficiente
ALTER TABLE public.knowledge_base 
ADD COLUMN word_count INTEGER DEFAULT 0,
ADD COLUMN chunk_summary TEXT,
ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Habilitar RLS na tabela chat_leads
ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;

-- Política para chat_leads (admins podem ver todos, função pode inserir)
CREATE POLICY "Admins can manage chat leads" ON public.chat_leads
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Functions can insert chat leads" ON public.chat_leads
  FOR INSERT WITH CHECK (true);

-- Adicionar índices para melhor performance
CREATE INDEX idx_chat_leads_email ON public.chat_leads(email);
CREATE INDEX idx_chat_leads_conversation ON public.chat_leads(conversation_id);
CREATE INDEX idx_knowledge_base_document ON public.knowledge_base(document_id);
CREATE INDEX idx_knowledge_base_chunk_text ON public.knowledge_base USING gin(to_tsvector('portuguese', chunk_text));

-- Função para busca de texto melhorada
CREATE OR REPLACE FUNCTION public.search_knowledge_base(
  search_query TEXT,
  limit_results INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_text TEXT,
  chunk_index INTEGER,
  document_name TEXT,
  similarity_score REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    kb.id,
    kb.document_id,
    kb.chunk_text,
    kb.chunk_index,
    d.name as document_name,
    ts_rank(to_tsvector('portuguese', kb.chunk_text), plainto_tsquery('portuguese', search_query)) as similarity_score
  FROM public.knowledge_base kb
  JOIN public.documents d ON kb.document_id = d.id
  WHERE d.processed = true
    AND to_tsvector('portuguese', kb.chunk_text) @@ plainto_tsquery('portuguese', search_query)
  ORDER BY similarity_score DESC, kb.chunk_index ASC
  LIMIT limit_results;
END;
$$;
