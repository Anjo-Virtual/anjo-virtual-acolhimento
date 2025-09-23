-- Fix SECURITY DEFINER functions security issue
-- Remove SECURITY DEFINER from functions where it's not necessary
-- Handle dependencies properly

-- First, recreate functions without SECURITY DEFINER but keeping same signatures
-- This avoids breaking existing policies

-- Replace get_current_user_profile_id (no dependencies to worry about)
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

-- Replace current_user_is_admin (has many dependencies, so just remove SECURITY DEFINER)
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

-- Replace is_admin (remove SECURITY DEFINER)
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

-- Replace has_role (remove SECURITY DEFINER)
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

-- Improve check_rate_limit security (keep SECURITY DEFINER but add more validation)
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
    -- Strict input validation
    IF client_ip IS NULL OR form_name IS NULL OR form_name = '' THEN
        RETURN false;
    END IF;
    
    -- Sanitize and limit parameters to prevent abuse
    max_submissions := LEAST(GREATEST(max_submissions, 1), 100);
    window_minutes := LEAST(GREATEST(window_minutes, 1), 1440);
    
    -- Only allow specific form types to prevent abuse
    IF form_name NOT IN ('contact_form', 'newsletter_signup') THEN
        RETURN false;
    END IF;
    
    window_start_time := now() - (window_minutes || ' minutes')::interval;
    
    -- Clean up old entries first
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

-- Improve validate_whatsapp_config (keep SECURITY DEFINER but add validation)
CREATE OR REPLACE FUNCTION public.validate_whatsapp_config(config jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Strict input validation
  IF config IS NULL THEN
    RETURN false;
  END IF;
  
  -- Only allow admin users to call this function
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')) THEN
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

-- Improve authentication trigger functions (keep SECURITY DEFINER but add validation)
CREATE OR REPLACE FUNCTION public.handle_new_community_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow this for actual new user registrations
  IF NEW.aud = 'authenticated' AND NEW.role = 'authenticated' AND OLD IS NULL THEN
    -- Prevent duplicate profiles
    IF NOT EXISTS (SELECT 1 FROM public.community_profiles WHERE user_id = NEW.id) THEN
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
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow this for actual new user registrations
  IF NEW.aud = 'authenticated' AND NEW.role = 'authenticated' AND OLD IS NULL THEN
    -- Prevent duplicate roles
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.id) THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'community_member');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;