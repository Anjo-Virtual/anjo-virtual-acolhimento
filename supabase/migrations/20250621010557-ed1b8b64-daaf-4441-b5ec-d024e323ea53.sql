
-- Remover todas as políticas existentes primeiro
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
DROP POLICY IF EXISTS "Anyone can view groups" ON public.community_groups;
DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.community_groups;
DROP POLICY IF EXISTS "Anyone can view community groups" ON public.community_groups;
DROP POLICY IF EXISTS "Authenticated users can create community groups" ON public.community_groups;
DROP POLICY IF EXISTS "Group creators can update their groups" ON public.community_groups;
DROP POLICY IF EXISTS "Users can view group memberships" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups as themselves" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave their own groups" ON public.group_members;

-- Recriar a função get_current_user_profile_id mais robusta
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

-- Criar políticas para community_groups com nomes únicos
CREATE POLICY "groups_select_policy"
ON public.community_groups
FOR SELECT
USING (true);

CREATE POLICY "groups_insert_policy"
ON public.community_groups
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND created_by = public.get_current_user_profile_id());

CREATE POLICY "groups_update_policy"
ON public.community_groups
FOR UPDATE
USING (created_by = public.get_current_user_profile_id());

-- Criar políticas para group_members com nomes únicos
CREATE POLICY "members_select_policy"
ON public.group_members
FOR SELECT
USING (true);

CREATE POLICY "members_insert_policy"
ON public.group_members
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND profile_id = public.get_current_user_profile_id());

CREATE POLICY "members_delete_policy"
ON public.group_members
FOR DELETE
USING (profile_id = public.get_current_user_profile_id());

-- Garantir que as tabelas têm RLS habilitado
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Criar função para debugar perfis de usuário
CREATE OR REPLACE FUNCTION public.debug_user_profile(user_uuid uuid DEFAULT auth.uid())
RETURNS TABLE(
  profile_exists boolean,
  profile_id uuid,
  display_name text,
  user_id uuid
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    EXISTS(SELECT 1 FROM public.community_profiles WHERE user_id = user_uuid) as profile_exists,
    cp.id as profile_id,
    cp.display_name,
    cp.user_id
  FROM public.community_profiles cp
  WHERE cp.user_id = user_uuid
  LIMIT 1;
$$;
