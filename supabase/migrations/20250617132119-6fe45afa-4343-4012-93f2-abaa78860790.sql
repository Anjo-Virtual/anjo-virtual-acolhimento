
-- Phase 1: Critical RLS Policy Implementation

-- 1. Secure site_settings table (CRITICAL - currently allows any access)
DROP POLICY IF EXISTS "Allow admins full access to site settings" ON public.site_settings;

CREATE POLICY "Only admins can access site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 2. Add RLS policies for contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 3. Add RLS policies for newsletter_subscriptions
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all newsletter subscriptions"
  ON public.newsletter_subscriptions
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update newsletter subscriptions"
  ON public.newsletter_subscriptions
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4. Secure community_user_roles table
ALTER TABLE public.community_user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.community_user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = community_user_roles.profile_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all user roles"
  ON public.community_user_roles
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 5. Secure blog_posts table (admin-only management)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admins can manage all blog posts"
  ON public.blog_posts
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 6. Secure integrations table (admin-only)
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access integrations"
  ON public.integrations
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 7. Secure chat_prompts table (admin-only)
ALTER TABLE public.chat_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage chat prompts"
  ON public.chat_prompts
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 8. Add security function for WhatsApp config validation
CREATE OR REPLACE FUNCTION public.validate_whatsapp_config(config jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate that destination_number exists and is a valid format
  IF config ? 'destination_number' AND 
     config->>'destination_number' ~ '^[0-9]{10,15}$' THEN
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

-- 9. Add audit logging table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));
