-- Fix SECURITY DEFINER functions security issue
-- Remove SECURITY DEFINER from functions where it's not necessary
-- and restructure security approach to be more secure

-- Replace get_current_user_profile_id with a safer version
DROP FUNCTION IF EXISTS public.get_current_user_profile_id();
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT id FROM public.community_profiles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- Replace current_user_is_admin with a safer version
DROP FUNCTION IF EXISTS public.current_user_is_admin();
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

-- Replace is_admin with a safer version (remove SECURITY DEFINER)
DROP FUNCTION IF EXISTS public.is_admin(uuid);
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'super_admin')
  );
$$;

-- Replace has_role with a safer version
DROP FUNCTION IF EXISTS public.has_role(uuid, user_role);
CREATE OR REPLACE FUNCTION public.has_role(user_uuid uuid, role_name user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = user_uuid AND role = role_name
  );
$$;

-- Keep check_rate_limit as SECURITY DEFINER since it needs elevated permissions
-- to manage rate limiting table, but make it more secure
DROP FUNCTION IF EXISTS public.check_rate_limit(inet, text, integer, integer);
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
    -- Input validation
    IF client_ip IS NULL OR form_name IS NULL OR form_name = '' THEN
        RETURN false;
    END IF;
    
    -- Sanitize inputs
    max_submissions := LEAST(GREATEST(max_submissions, 1), 100);
    window_minutes := LEAST(GREATEST(window_minutes, 1), 1440);
    
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

-- Keep validate_whatsapp_config as SECURITY DEFINER but make it more secure
DROP FUNCTION IF EXISTS public.validate_whatsapp_config(jsonb);
CREATE OR REPLACE FUNCTION public.validate_whatsapp_config(config jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Input validation
  IF config IS NULL THEN
    RETURN false;
  END IF;
  
  -- Validate WhatsApp config structure
  IF config ? 'destination_number' AND 
     config->>'destination_number' ~ '^[0-9]{10,15}$' THEN
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

-- Keep authentication-related trigger functions as SECURITY DEFINER
-- but ensure they're secure
DROP FUNCTION IF EXISTS public.handle_new_community_user();
CREATE OR REPLACE FUNCTION public.handle_new_community_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow this for actual new user registrations
  IF NEW.aud = 'authenticated' AND NEW.role = 'authenticated' THEN
    INSERT INTO public.community_profiles (user_id, display_name, is_anonymous)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'display_name', 'Membro Anônimo'),
      COALESCE((NEW.raw_user_meta_data->>'is_anonymous')::boolean, true)
    );
    
    -- Add default member role
    INSERT INTO public.community_user_roles (profile_id, role)
    SELECT id, 'member'
    FROM public.community_profiles
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.handle_new_user_role();
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow this for actual new user registrations
  IF NEW.aud = 'authenticated' AND NEW.role = 'authenticated' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'community_member');
  END IF;
  
  RETURN NEW;
END;
$$;