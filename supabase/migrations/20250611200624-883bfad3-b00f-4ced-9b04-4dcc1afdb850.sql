
-- Criar índices para otimizar as consultas mais frequentes
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_published ON forum_posts(category_id, is_published);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_post_likes_post_id ON forum_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_likes_user_post ON forum_post_likes(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_published ON forum_comments(post_id, is_published);
CREATE INDEX IF NOT EXISTS idx_community_profiles_user_id ON community_profiles(user_id);

-- Criar uma view otimizada para posts com contadores
CREATE OR REPLACE VIEW forum_posts_with_stats AS
SELECT 
    p.id,
    p.title,
    p.content,
    p.created_at,
    p.updated_at,
    p.view_count,
    p.category_id,
    p.author_id,
    p.is_published,
    p.is_pinned,
    -- Contar likes
    COALESCE(likes.count, 0) as likes_count,
    -- Contar comentários publicados
    COALESCE(comments.count, 0) as comments_count,
    -- Dados da categoria
    c.name as category_name,
    c.slug as category_slug,
    c.color as category_color,
    -- Dados do autor
    cp.display_name as author_display_name,
    cp.is_anonymous as author_is_anonymous
FROM forum_posts p
LEFT JOIN forum_categories c ON p.category_id = c.id
LEFT JOIN community_profiles cp ON p.author_id = cp.user_id
LEFT JOIN (
    SELECT post_id, COUNT(*) as count
    FROM forum_post_likes
    GROUP BY post_id
) likes ON p.id = likes.post_id
LEFT JOIN (
    SELECT post_id, COUNT(*) as count
    FROM forum_comments
    WHERE is_published = true
    GROUP BY post_id
) comments ON p.id = comments.post_id;

-- Criar função para verificar se usuário curtiu um post específico
CREATE OR REPLACE FUNCTION user_has_liked_post(user_uuid uuid, post_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM forum_post_likes 
        WHERE user_id = user_uuid 
        AND post_id = post_uuid
    );
$$;
