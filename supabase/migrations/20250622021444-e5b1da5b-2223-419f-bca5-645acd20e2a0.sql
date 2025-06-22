
-- Primeiro, inserir as categorias predefinidas no banco
INSERT INTO public.forum_categories (name, description, slug, color, icon, sort_order, is_active) 
VALUES 
  ('Apoio Emocional', 'Compartilhe seus sentimentos e encontre apoio da comunidade', 'apoio-emocional', '#3B82F6', 'heart', 1, true),
  ('Histórias de Superação', 'Inspire-se e inspire outros com histórias de força e esperança', 'historias-superacao', '#10B981', 'star', 2, true),
  ('Dúvidas e Orientações', 'Tire suas dúvidas e compartilhe orientações úteis', 'duvidas-orientacoes', '#F59E0B', 'help-circle', 3, true),
  ('Grupos de Apoio', 'Conecte-se com grupos específicos de apoio', 'grupos-apoio', '#8B5CF6', 'users', 4, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- Remover políticas problemáticas que causam recursão infinita
DROP POLICY IF EXISTS "groups_select_policy" ON public.community_groups;
DROP POLICY IF EXISTS "groups_insert_policy" ON public.community_groups;
DROP POLICY IF EXISTS "groups_update_policy" ON public.community_groups;
DROP POLICY IF EXISTS "members_select_policy" ON public.group_members;
DROP POLICY IF EXISTS "members_insert_policy" ON public.group_members;
DROP POLICY IF EXISTS "members_delete_policy" ON public.group_members;

-- Criar políticas mais simples para evitar recursão
CREATE POLICY "allow_all_select_groups"
ON public.community_groups
FOR SELECT
USING (true);

CREATE POLICY "allow_authenticated_insert_groups"
ON public.community_groups
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "allow_creator_update_groups"
ON public.community_groups
FOR UPDATE
TO authenticated
USING (
  EXISTS(
    SELECT 1 FROM public.community_profiles 
    WHERE user_id = auth.uid() AND id = community_groups.created_by
  )
);

CREATE POLICY "allow_all_select_members"
ON public.group_members
FOR SELECT
USING (true);

CREATE POLICY "allow_authenticated_insert_members"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS(
    SELECT 1 FROM public.community_profiles 
    WHERE user_id = auth.uid() AND id = group_members.profile_id
  )
);

CREATE POLICY "allow_user_delete_own_membership"
ON public.group_members
FOR DELETE
TO authenticated
USING (
  EXISTS(
    SELECT 1 FROM public.community_profiles 
    WHERE user_id = auth.uid() AND id = group_members.profile_id
  )
);

-- Criar view para posts com estatísticas das categorias
CREATE OR REPLACE VIEW public.forum_categories_with_stats AS
SELECT 
  fc.*,
  COALESCE(post_counts.posts_count, 0) as posts_count,
  COALESCE(recent_activity.last_activity, fc.created_at) as last_activity
FROM public.forum_categories fc
LEFT JOIN (
  SELECT 
    category_id,
    COUNT(*) as posts_count
  FROM public.forum_posts 
  WHERE is_published = true
  GROUP BY category_id
) post_counts ON fc.id = post_counts.category_id
LEFT JOIN (
  SELECT 
    category_id,
    MAX(created_at) as last_activity
  FROM public.forum_posts 
  WHERE is_published = true
  GROUP BY category_id
) recent_activity ON fc.id = recent_activity.category_id
WHERE fc.is_active = true
ORDER BY fc.sort_order;
