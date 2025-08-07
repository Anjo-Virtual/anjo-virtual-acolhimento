-- Fix critical security issues from the migration

-- Fix forum_categories_with_stats view - enable RLS on the base table first
ALTER TABLE public.forum_categories_with_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for forum_categories_with_stats view
CREATE POLICY "Anyone can view categories with stats"
ON public.forum_categories_with_stats
FOR SELECT
TO authenticated
USING (true);

-- Fix forum_posts_with_stats view - enable RLS
ALTER TABLE public.forum_posts_with_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for forum_posts_with_stats view  
CREATE POLICY "Anyone can view posts with stats"
ON public.forum_posts_with_stats
FOR SELECT
TO authenticated
USING (true);

-- Update the current_user_is_admin function with proper search_path
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
$$;