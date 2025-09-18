-- Check for any remaining SECURITY DEFINER functions that might need fixing
-- and recreate the views to ensure they don't have security definer properties

-- Drop and recreate views to ensure they don't inherit any security definer properties
DROP VIEW IF EXISTS public.forum_categories_with_stats;
DROP VIEW IF EXISTS public.forum_posts_with_stats;

-- Recreate forum_categories_with_stats view (clean, without any security definer)
CREATE VIEW public.forum_categories_with_stats AS
SELECT 
    fc.id,
    fc.name,
    fc.description,
    fc.slug,
    fc.color,
    fc.icon,
    fc.sort_order,
    fc.is_active,
    fc.moderator_only,
    fc.created_at,
    COALESCE(post_counts.posts_count, 0::bigint) AS posts_count,
    COALESCE(recent_activity.last_activity, fc.created_at) AS last_activity
FROM forum_categories fc
LEFT JOIN (
    SELECT 
        category_id,
        count(*) AS posts_count
    FROM forum_posts
    WHERE is_published = true
    GROUP BY category_id
) post_counts ON fc.id = post_counts.category_id
LEFT JOIN (
    SELECT 
        category_id,
        max(created_at) AS last_activity
    FROM forum_posts
    WHERE is_published = true
    GROUP BY category_id
) recent_activity ON fc.id = recent_activity.category_id
WHERE fc.is_active = true
ORDER BY fc.sort_order;

-- Recreate forum_posts_with_stats view (clean, without any security definer)
CREATE VIEW public.forum_posts_with_stats AS
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
    COALESCE(likes.count, 0::bigint) AS likes_count,
    COALESCE(comments.count, 0::bigint) AS comments_count,
    c.name AS category_name,
    c.slug AS category_slug,
    c.color AS category_color,
    cp.display_name AS author_display_name,
    cp.is_anonymous AS author_is_anonymous
FROM forum_posts p
LEFT JOIN forum_categories c ON p.category_id = c.id
LEFT JOIN community_profiles cp ON p.author_id = cp.user_id
LEFT JOIN (
    SELECT 
        post_id,
        count(*) AS count
    FROM forum_post_likes
    GROUP BY post_id
) likes ON p.id = likes.post_id
LEFT JOIN (
    SELECT 
        post_id,
        count(*) AS count
    FROM forum_comments
    WHERE is_published = true
    GROUP BY post_id
) comments ON p.id = comments.post_id;