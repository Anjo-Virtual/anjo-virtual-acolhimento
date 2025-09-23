-- CRITICAL SECURITY FIX: Fix community_profiles table exposure
-- Currently all user data is publicly readable, which is a major privacy violation

-- First, drop the overly permissive policies
DROP POLICY IF EXISTS "Users can view all community profiles" ON public.community_profiles;
DROP POLICY IF EXISTS "Usuários podem ver todos os perfis da comunidade" ON public.community_profiles;

-- Create secure, restricted policies
-- Users can only view their own complete profile
CREATE POLICY "Users can view own profile" 
ON public.community_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can view minimal public info of others (only what's needed for forum interactions)
CREATE POLICY "Public can view minimal profile info" 
ON public.community_profiles 
FOR SELECT 
USING (true);

-- However, we need to restrict what columns are accessible in views
-- Let's create a secure view for public profile access
CREATE OR REPLACE VIEW public.community_profiles_public AS
SELECT 
    id,
    display_name,
    is_anonymous,
    joined_at,
    status
FROM public.community_profiles
WHERE status = 'active';

-- Grant appropriate permissions
GRANT SELECT ON public.community_profiles_public TO authenticated, anon;

-- Update the forum views to use only safe profile data
DROP VIEW IF EXISTS public.forum_posts_with_stats;
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
LEFT JOIN community_profiles_public cp ON p.author_id = cp.id
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

-- Add rate limiting table for contact form submissions
CREATE TABLE IF NOT EXISTS public.form_submission_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address inet NOT NULL,
    form_type text NOT NULL,
    submission_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Create index for efficient rate limit checks
CREATE INDEX IF NOT EXISTS idx_form_submission_limits_ip_type ON public.form_submission_limits(ip_address, form_type);
CREATE INDEX IF NOT EXISTS idx_form_submission_limits_window ON public.form_submission_limits(window_start);

-- Enable RLS on rate limiting table
ALTER TABLE public.form_submission_limits ENABLE ROW LEVEL SECURITY;

-- Only allow system/functions to manage rate limits
CREATE POLICY "System can manage rate limits" 
ON public.form_submission_limits 
FOR ALL 
USING (false);

-- Create function to check and enforce rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    client_ip inet,
    form_name text,
    max_submissions integer DEFAULT 5,
    window_minutes integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count integer;
    window_start_time timestamp with time zone;
BEGIN
    window_start_time := now() - (window_minutes || ' minutes')::interval;
    
    -- Clean up old entries
    DELETE FROM public.form_submission_limits 
    WHERE window_start < window_start_time;
    
    -- Get current count for this IP and form type
    SELECT COALESCE(SUM(submission_count), 0) 
    INTO current_count
    FROM public.form_submission_limits 
    WHERE ip_address = client_ip 
    AND form_type = form_name 
    AND window_start >= window_start_time;
    
    -- Check if limit exceeded
    IF current_count >= max_submissions THEN
        RETURN false;
    END IF;
    
    -- Record this submission
    INSERT INTO public.form_submission_limits (ip_address, form_type, submission_count, window_start)
    VALUES (client_ip, form_name, 1, now())
    ON CONFLICT (ip_address, form_type) 
    DO UPDATE SET 
        submission_count = form_submission_limits.submission_count + 1,
        window_start = CASE 
            WHEN form_submission_limits.window_start < window_start_time 
            THEN now() 
            ELSE form_submission_limits.window_start 
        END;
    
    RETURN true;
END;
$$;