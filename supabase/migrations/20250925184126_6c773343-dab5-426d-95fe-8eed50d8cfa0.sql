-- Remove SECURITY DEFINER from functions that don't need elevated privileges
-- Keep it only for functions that genuinely need system-level access

-- Functions that can be converted to SECURITY INVOKER (safer):
-- These functions don't need elevated privileges

-- Convert functions to SECURITY INVOKER where possible
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS uuid
LANGUAGE sql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
STABLE
SET search_path = public
AS $$
  SELECT id FROM public.community_profiles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(user_uuid uuid, role_name user_role)
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = user_uuid AND role = role_name
  );
$$;

CREATE OR REPLACE FUNCTION public.user_has_liked_post(user_uuid uuid, post_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
      SELECT 1 
      FROM public.forum_post_likes 
      WHERE user_id = user_uuid 
      AND post_id = post_uuid
  );
$$;

CREATE OR REPLACE FUNCTION public.debug_user_profile(user_uuid uuid DEFAULT auth.uid())
RETURNS TABLE(profile_exists boolean, profile_id uuid, display_name text, user_id uuid)
LANGUAGE sql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
STABLE
SET search_path = public
AS $$
  SELECT 
    EXISTS(SELECT 1 FROM public.community_profiles WHERE user_id = user_uuid) as profile_exists,
    cp.id as profile_id,
    cp.display_name,
    cp.user_id
  FROM public.community_profiles cp
  WHERE cp.user_id = user_uuid
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.search_knowledge_base(search_query text, limit_results integer DEFAULT 5)
RETURNS TABLE(id uuid, document_id uuid, chunk_text text, chunk_index integer, document_name text, similarity_score real)
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    kb.id,
    kb.document_id,
    kb.chunk_text,
    kb.chunk_index,
    d.name as document_name,
    ts_rank(to_tsvector('portuguese', kb.chunk_text), plainto_tsquery('portuguese', search_query)) as similarity_score
  FROM public.knowledge_base kb
  JOIN public.documents d ON kb.document_id = d.id
  WHERE d.processed = true
    AND to_tsvector('portuguese', kb.chunk_text) @@ plainto_tsquery('portuguese', search_query)
  ORDER BY similarity_score DESC, kb.chunk_index ASC
  LIMIT limit_results;
END;
$$;

-- Add comments explaining security model
COMMENT ON FUNCTION public.get_current_user_profile_id IS 'SECURITY INVOKER: Uses caller permissions, no elevated privileges needed';
COMMENT ON FUNCTION public.current_user_is_admin IS 'SECURITY INVOKER: Uses caller permissions, no elevated privileges needed';
COMMENT ON FUNCTION public.is_admin IS 'SECURITY INVOKER: Uses caller permissions, no elevated privileges needed';
COMMENT ON FUNCTION public.has_role IS 'SECURITY INVOKER: Uses caller permissions, no elevated privileges needed';
COMMENT ON FUNCTION public.user_has_liked_post IS 'SECURITY INVOKER: Uses caller permissions, no elevated privileges needed';
COMMENT ON FUNCTION public.debug_user_profile IS 'SECURITY INVOKER: Uses caller permissions, no elevated privileges needed';
COMMENT ON FUNCTION public.search_knowledge_base IS 'SECURITY INVOKER: Uses caller permissions, no elevated privileges needed';