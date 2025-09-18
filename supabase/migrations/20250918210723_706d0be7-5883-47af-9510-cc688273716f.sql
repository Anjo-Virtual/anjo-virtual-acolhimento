-- Fix potential security issues with SECURITY DEFINER functions
-- Some of these functions might be exposing data inappropriately

-- The search_knowledge_base function should respect RLS
-- Let's remove SECURITY DEFINER from it and let it use the caller's permissions
CREATE OR REPLACE FUNCTION public.search_knowledge_base(search_query text, limit_results integer DEFAULT 5)
 RETURNS TABLE(id uuid, document_id uuid, chunk_text text, chunk_index integer, document_name text, similarity_score real)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
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
$function$;

-- The user_has_liked_post function should also use caller's permissions
CREATE OR REPLACE FUNCTION public.user_has_liked_post(user_uuid uuid, post_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
      SELECT 1 
      FROM public.forum_post_likes 
      WHERE user_id = user_uuid 
      AND post_id = post_uuid
  );
$function$;

-- The debug_user_profile function should be restricted to admins or removed entirely
-- as it can expose user data - let's remove SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.debug_user_profile(user_uuid uuid DEFAULT auth.uid())
 RETURNS TABLE(profile_exists boolean, profile_id uuid, display_name text, user_id uuid)
 LANGUAGE sql
 STABLE  
 SET search_path TO 'public'
AS $function$
  SELECT 
    EXISTS(SELECT 1 FROM public.community_profiles WHERE user_id = user_uuid) as profile_exists,
    cp.id as profile_id,
    cp.display_name,
    cp.user_id
  FROM public.community_profiles cp
  WHERE cp.user_id = user_uuid
  LIMIT 1;
$function$;