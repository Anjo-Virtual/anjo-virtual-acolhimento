
-- Fase 1: Limpar TODAS as políticas RLS problemáticas

-- Remover políticas de community_groups
DROP POLICY IF EXISTS "simple_groups_read" ON public.community_groups;
DROP POLICY IF EXISTS "simple_groups_create" ON public.community_groups;
DROP POLICY IF EXISTS "simple_groups_update" ON public.community_groups;
DROP POLICY IF EXISTS "public_read_groups" ON public.community_groups;
DROP POLICY IF EXISTS "authenticated_create_groups" ON public.community_groups;
DROP POLICY IF EXISTS "owner_update_groups" ON public.community_groups;
DROP POLICY IF EXISTS "allow_all_select_groups" ON public.community_groups;
DROP POLICY IF EXISTS "allow_authenticated_insert_groups" ON public.community_groups;
DROP POLICY IF EXISTS "allow_creator_update_groups" ON public.community_groups;

-- Remover políticas de group_members
DROP POLICY IF EXISTS "simple_members_read" ON public.group_members;
DROP POLICY IF EXISTS "simple_members_create" ON public.group_members;
DROP POLICY IF EXISTS "simple_members_delete" ON public.group_members;
DROP POLICY IF EXISTS "public_read_members" ON public.group_members;
DROP POLICY IF EXISTS "user_join_groups" ON public.group_members;
DROP POLICY IF EXISTS "user_leave_groups" ON public.group_members;
DROP POLICY IF EXISTS "allow_all_select_members" ON public.group_members;
DROP POLICY IF EXISTS "allow_authenticated_insert_members" ON public.group_members;
DROP POLICY IF EXISTS "allow_user_delete_own_membership" ON public.group_members;

-- Remover políticas de forum_categories se existirem
DROP POLICY IF EXISTS "public_read_categories" ON public.forum_categories;

-- Criar políticas ULTRA-SIMPLES para evitar recursão

-- Políticas para forum_categories (leitura pública)
CREATE POLICY "anyone_can_read_categories"
ON public.forum_categories
FOR SELECT
USING (true);

-- Políticas para community_groups (leitura pública, criação autenticada)
CREATE POLICY "anyone_can_read_groups"
ON public.community_groups
FOR SELECT
USING (true);

CREATE POLICY "authenticated_can_create_groups"
ON public.community_groups
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_can_update_groups"
ON public.community_groups
FOR UPDATE
TO authenticated
USING (true);

-- Políticas para group_members (operações básicas)
CREATE POLICY "anyone_can_read_members"
ON public.group_members
FOR SELECT
USING (true);

CREATE POLICY "authenticated_can_join_groups"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_can_leave_groups"
ON public.group_members
FOR DELETE
TO authenticated
USING (true);

-- Garantir que RLS está habilitado
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
