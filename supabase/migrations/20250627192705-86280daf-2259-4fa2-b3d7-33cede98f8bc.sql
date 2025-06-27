
-- Primeiro, vamos remover as políticas problemáticas
DROP POLICY IF EXISTS "Admins can view all categories" ON public.forum_categories;
DROP POLICY IF EXISTS "Everyone can view active categories" ON public.forum_categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.forum_categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.forum_categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.forum_categories;

-- Criar função de segurança para verificar se usuário é admin (evita recursão)
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Recriar as políticas usando a função de segurança
CREATE POLICY "Admins can view all categories" 
ON public.forum_categories 
FOR SELECT 
TO authenticated
USING (public.current_user_is_admin());

-- Política para todos verem categorias ativas
CREATE POLICY "Everyone can view active categories" 
ON public.forum_categories 
FOR SELECT 
TO authenticated
USING (is_active = true OR public.current_user_is_admin());

-- Política para admins criarem categorias
CREATE POLICY "Admins can insert categories" 
ON public.forum_categories 
FOR INSERT 
TO authenticated
WITH CHECK (public.current_user_is_admin());

-- Política para admins atualizarem categorias
CREATE POLICY "Admins can update categories" 
ON public.forum_categories 
FOR UPDATE 
TO authenticated
USING (public.current_user_is_admin());

-- Política para admins excluírem categorias
CREATE POLICY "Admins can delete categories" 
ON public.forum_categories 
FOR DELETE 
TO authenticated
USING (public.current_user_is_admin());
