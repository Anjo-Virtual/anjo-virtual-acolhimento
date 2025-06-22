
-- Remover TODAS as políticas que causam recursão
DROP POLICY IF EXISTS "public_read_groups" ON public.community_groups;
DROP POLICY IF EXISTS "authenticated_create_groups" ON public.community_groups;
DROP POLICY IF EXISTS "owner_update_groups" ON public.community_groups;
DROP POLICY IF EXISTS "public_read_members" ON public.group_members;
DROP POLICY IF EXISTS "user_join_groups" ON public.group_members;
DROP POLICY IF EXISTS "user_leave_groups" ON public.group_members;

-- Políticas ULTRA simplificadas para community_groups
CREATE POLICY "simple_groups_read"
ON public.community_groups
FOR SELECT
USING (true);

CREATE POLICY "simple_groups_create"
ON public.community_groups
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "simple_groups_update"
ON public.community_groups
FOR UPDATE
TO authenticated
USING (true);

-- Políticas ULTRA simplificadas para group_members
CREATE POLICY "simple_members_read"
ON public.group_members
FOR SELECT
USING (true);

CREATE POLICY "simple_members_create"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "simple_members_delete"
ON public.group_members
FOR DELETE
TO authenticated
USING (true);

-- Garantir RLS habilitado
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
