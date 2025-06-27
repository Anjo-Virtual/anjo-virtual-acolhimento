
-- Verificar se existem políticas RLS na tabela forum_categories
-- Se não existirem, vamos criar políticas que permitam admins gerenciar categorias

-- Habilitar RLS na tabela forum_categories se não estiver habilitado
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que admins vejam todas as categorias
CREATE POLICY "Admins can view all categories" 
ON public.forum_categories 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Criar política para permitir que todos vejam categorias ativas
CREATE POLICY "Everyone can view active categories" 
ON public.forum_categories 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Criar política para permitir que admins insiram categorias
CREATE POLICY "Admins can insert categories" 
ON public.forum_categories 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Criar política para permitir que admins atualizem categorias
CREATE POLICY "Admins can update categories" 
ON public.forum_categories 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Criar política para permitir que admins excluam categorias
CREATE POLICY "Admins can delete categories" 
ON public.forum_categories 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);
