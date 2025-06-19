
-- Primeiro, remover todas as políticas que dependem das funções
DROP POLICY IF EXISTS "Users can view group members if they are members" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups they joined" ON public.group_members;
DROP POLICY IF EXISTS "Users can view group members" ON public.group_members;
DROP POLICY IF EXISTS "Users can insert group members" ON public.group_members;
DROP POLICY IF EXISTS "Users can update group members" ON public.group_members;
DROP POLICY IF EXISTS "Users can delete group members" ON public.group_members;

-- Agora remover as funções com CASCADE
DROP FUNCTION IF EXISTS public.is_group_member(uuid,uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_group_creator(uuid,uuid) CASCADE;

-- Criar função para obter perfil do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id FROM public.community_profiles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- Políticas RLS para group_members sem recursão
CREATE POLICY "Users can view their own memberships"
ON public.group_members
FOR SELECT
USING (profile_id = public.get_current_user_profile_id());

CREATE POLICY "Users can join groups"
ON public.group_members
FOR INSERT
WITH CHECK (profile_id = public.get_current_user_profile_id());

CREATE POLICY "Users can leave groups"
ON public.group_members
FOR DELETE
USING (profile_id = public.get_current_user_profile_id());

-- Políticas para community_groups
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.community_groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.community_groups;
DROP POLICY IF EXISTS "Anyone can view groups" ON public.community_groups;
DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.community_groups;

CREATE POLICY "Anyone can view groups"
ON public.community_groups
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create groups"
ON public.community_groups
FOR INSERT
WITH CHECK (created_by = public.get_current_user_profile_id());

-- Habilitar RLS nas tabelas se não estiver habilitado
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
