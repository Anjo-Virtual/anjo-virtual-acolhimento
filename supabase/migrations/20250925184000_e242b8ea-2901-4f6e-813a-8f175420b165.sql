-- Fix Security Definer View issue by removing or recreating problematic views
-- The linter is flagging views that may have SECURITY DEFINER property

-- First, let's check what these problematic objects are and recreate them properly
-- Drop and recreate views that may have SECURITY DEFINER

-- Drop the views that might be problematic
DROP VIEW IF EXISTS public.forum_categories_with_stats CASCADE;
DROP VIEW IF EXISTS public.forum_posts_with_stats CASCADE;
DROP VIEW IF EXISTS public.community_profiles_public CASCADE;

-- Recreate forum_categories_with_stats without SECURITY DEFINER
CREATE VIEW public.forum_categories_with_stats AS
SELECT 
    fc.*,
    COALESCE(post_counts.posts_count, 0) as posts_count,
    latest_posts.last_activity
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
) latest_posts ON fc.id = latest_posts.category_id;

-- Recreate forum_posts_with_stats without SECURITY DEFINER
CREATE VIEW public.forum_posts_with_stats AS
SELECT 
    fp.*,
    fc.name as category_name,
    fc.slug as category_slug,
    fc.color as category_color,
    cp.display_name as author_display_name,
    cp.is_anonymous as author_is_anonymous,
    COALESCE(like_counts.likes_count, 0) as likes_count,
    COALESCE(comment_counts.comments_count, 0) as comments_count
FROM public.forum_posts fp
LEFT JOIN public.forum_categories fc ON fp.category_id = fc.id
LEFT JOIN public.community_profiles cp ON fp.author_id = cp.id
LEFT JOIN (
    SELECT 
        post_id,
        COUNT(*) as likes_count
    FROM public.forum_post_likes
    GROUP BY post_id
) like_counts ON fp.id = like_counts.post_id
LEFT JOIN (
    SELECT 
        post_id,
        COUNT(*) as comments_count
    FROM public.forum_comments
    WHERE is_published = true
    GROUP BY post_id
) comment_counts ON fp.id = comment_counts.post_id;

-- Recreate community_profiles_public as a regular view without SECURITY DEFINER
CREATE VIEW public.community_profiles_public AS
SELECT 
    id,
    display_name,
    is_anonymous,
    joined_at,
    status
FROM public.community_profiles
WHERE status = 'active';

-- Add proper comments to document these views
COMMENT ON VIEW public.forum_categories_with_stats IS 'View providing forum categories with post statistics - no elevated privileges needed';
COMMENT ON VIEW public.forum_posts_with_stats IS 'View providing forum posts with aggregated statistics - no elevated privileges needed';
COMMENT ON VIEW public.community_profiles_public IS 'Public view of community profiles showing only non-sensitive information - no elevated privileges needed';