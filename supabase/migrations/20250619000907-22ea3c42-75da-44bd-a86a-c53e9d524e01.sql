
-- Primeiro, vamos remover as políticas existentes que causam recursão infinita
DROP POLICY IF EXISTS "Users can view group members" ON group_members;
DROP POLICY IF EXISTS "Users can join groups" ON group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON group_members;

-- Criar função de segurança para verificar se um usuário é membro de um grupo
CREATE OR REPLACE FUNCTION public.is_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.group_members gm
    JOIN public.community_profiles cp ON gm.profile_id = cp.id
    WHERE gm.group_id = group_uuid 
    AND cp.user_id = user_uuid
  );
$$;

-- Criar função para verificar se um usuário é criador do grupo
CREATE OR REPLACE FUNCTION public.is_group_creator(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.community_groups cg
    JOIN public.community_profiles cp ON cg.created_by = cp.id
    WHERE cg.id = group_uuid 
    AND cp.user_id = user_uuid
  );
$$;

-- Criar políticas RLS seguras para group_members
CREATE POLICY "Users can view group members if they are members"
ON group_members FOR SELECT
USING (
  public.is_group_member(group_id, auth.uid()) OR
  public.is_group_creator(group_id, auth.uid())
);

CREATE POLICY "Users can join groups"
ON group_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM community_profiles 
    WHERE id = profile_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can leave groups they joined"
ON group_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM community_profiles 
    WHERE id = profile_id AND user_id = auth.uid()
  ) OR
  public.is_group_creator(group_id, auth.uid())
);

-- Habilitar RLS na tabela se não estiver habilitado
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
