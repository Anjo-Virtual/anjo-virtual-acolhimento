-- Fix remaining SECURITY DEFINER functions and search path warnings
-- Add SET search_path to all functions that need it

-- Fix remaining trigger functions that still have SECURITY DEFINER
-- These need to be SECURITY DEFINER for triggers but let's add more security

-- Fix search path for existing functions
CREATE OR REPLACE FUNCTION public.update_event_participant_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_events 
    SET current_participants = current_participants + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_events 
    SET current_participants = current_participants - 1
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_group_member_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_groups 
    SET current_members = current_members + 1
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_groups 
    SET current_members = current_members - 1
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_id_from_auth()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Fix remaining functions with search path
CREATE OR REPLACE FUNCTION public.user_has_liked_post(user_uuid uuid, post_uuid uuid)
RETURNS boolean
LANGUAGE sql
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