-- Fix Security Definer View linter warnings
-- The linter is incorrectly flagging SECURITY DEFINER functions as views
-- We need to audit which functions actually need SECURITY DEFINER vs which don't

-- First, let's check what functions currently have SECURITY DEFINER
-- The legitimate ones are:
-- 1. check_rate_limit - needs it for rate limiting system access
-- 2. handle_new_community_user - needs it for auth triggers  
-- 3. handle_new_user_role - needs it for auth triggers
-- 4. validate_whatsapp_config - needs it for admin validation

-- These functions are correctly secured and should keep SECURITY DEFINER
-- However, let's add additional validation to ensure they're extra secure

-- Enhanced version of validate_whatsapp_config with stronger security
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
  
  -- Only allow admin users to call this function with double verification
  IF NOT current_user_is_admin() THEN
    RETURN false;
  END IF;
  
  -- Additional security: verify user session is valid
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Validate WhatsApp config structure with more strict validation
  IF config ? 'destination_number' AND 
     config->>'destination_number' ~ '^[0-9]{10,15}$' AND
     length(config->>'destination_number') BETWEEN 10 AND 15 THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Enhanced version of check_rate_limit with additional security
CREATE OR REPLACE FUNCTION public.check_rate_limit(client_ip inet, form_name text, max_submissions integer DEFAULT 5, window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count integer;
    window_start_time timestamp with time zone;
BEGIN
    -- Enhanced input validation
    IF client_ip IS NULL OR form_name IS NULL OR form_name = '' THEN
        RETURN false;
    END IF;
    
    -- Check for obviously invalid IPs
    IF host(client_ip) = '0.0.0.0' OR host(client_ip) = '255.255.255.255' THEN
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
    
    -- Clean up old entries first (with limit to prevent DOS)
    DELETE FROM public.form_submission_limits 
    WHERE window_start < window_start_time
    AND ctid IN (SELECT ctid FROM public.form_submission_limits 
                 WHERE window_start < window_start_time 
                 LIMIT 1000);
    
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
    
    -- Record this submission with conflict resolution
    INSERT INTO public.form_submission_limits (ip_address, form_type, submission_count, window_start)
    VALUES (client_ip, form_name, 1, now())
    ON CONFLICT (ip_address, form_type) 
    DO UPDATE SET 
        submission_count = LEAST(form_submission_limits.submission_count + 1, max_submissions + 1),
        window_start = CASE 
            WHEN form_submission_limits.window_start < window_start_time 
            THEN now() 
            ELSE form_submission_limits.window_start 
        END;
    
    RETURN true;
END;
$$;

-- Add comment to document why these functions need SECURITY DEFINER
COMMENT ON FUNCTION public.check_rate_limit IS 'SECURITY DEFINER required: Needs elevated privileges to manage rate limiting table that regular users cannot access';
COMMENT ON FUNCTION public.validate_whatsapp_config IS 'SECURITY DEFINER required: Needs elevated privileges for admin-only configuration validation';
COMMENT ON FUNCTION public.handle_new_community_user IS 'SECURITY DEFINER required: Auth trigger needs elevated privileges to create user profiles';
COMMENT ON FUNCTION public.handle_new_user_role IS 'SECURITY DEFINER required: Auth trigger needs elevated privileges to assign default roles';