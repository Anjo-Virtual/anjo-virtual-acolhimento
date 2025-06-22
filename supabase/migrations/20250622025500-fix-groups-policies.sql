
-- Remover todas as políticas problemáticas que causam recursão
DROP POLICY IF EXISTS "allow_all_select_groups" ON public.community_groups;
DROP POLICY IF EXISTS "allow_authenticated_insert_groups" ON public.community_groups;
DROP POLICY IF EXISTS "allow_creator_update_groups" ON public.community_groups;
DROP POLICY IF EXISTS "allow_all_select_members" ON public.group_members;
DROP POLICY IF EXISTS "allow_authenticated_insert_members" ON public.group_members;
DROP POLICY IF EXISTS "allow_user_delete_own_membership" ON public.group_members;

-- Políticas simplificadas para community_groups (sem recursão)
CREATE POLICY "public_read_groups"
ON public.community_groups
FOR SELECT
USING (true);

CREATE POLICY "authenticated_create_groups"
ON public.community_groups
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "owner_update_groups"
ON public.community_groups
FOR UPDATE
TO authenticated
USING (created_by IN (
  SELECT id FROM public.community_profiles WHERE user_id = auth.uid()
));

-- Políticas simplificadas para group_members (sem recursão)
CREATE POLICY "public_read_members"
ON public.group_members
FOR SELECT
USING (true);

CREATE POLICY "user_join_groups"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  profile_id IN (
    SELECT id FROM public.community_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "user_leave_groups"
ON public.group_members
FOR DELETE
TO authenticated
USING (
  profile_id IN (
    SELECT id FROM public.community_profiles WHERE user_id = auth.uid()
  )
);

-- Verificar se RLS está habilitado
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
