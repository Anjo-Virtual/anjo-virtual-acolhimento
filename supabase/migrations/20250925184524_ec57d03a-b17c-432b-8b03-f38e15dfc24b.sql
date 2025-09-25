-- Check and fix remaining SECURITY DEFINER issues
-- The linter is still finding 3 SECURITY DEFINER objects

-- Convert trigger functions to SECURITY INVOKER where possible
-- Only keep SECURITY DEFINER for functions that genuinely need system privileges

-- Convert update trigger functions to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_event_participant_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
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

CREATE OR REPLACE FUNCTION public.update_group_member_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
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
SECURITY INVOKER  -- Changed from DEFINER to INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Add comments to document these functions
COMMENT ON FUNCTION public.update_updated_at_column IS 'SECURITY INVOKER: Uses caller permissions for timestamp updates';
COMMENT ON FUNCTION public.update_event_participant_count IS 'SECURITY INVOKER: Uses caller permissions for participant counting';
COMMENT ON FUNCTION public.update_group_member_count IS 'SECURITY INVOKER: Uses caller permissions for member counting';
COMMENT ON FUNCTION public.set_user_id_from_auth IS 'SECURITY INVOKER: Uses caller permissions for user ID setting';

-- Only these functions should remain as SECURITY DEFINER (they need elevated privileges):
-- 1. check_rate_limit - needs system access to rate limiting table
-- 2. validate_whatsapp_config - needs admin validation
-- 3. handle_new_community_user - auth trigger needs elevated privileges
-- 4. handle_new_user_role - auth trigger needs elevated privileges