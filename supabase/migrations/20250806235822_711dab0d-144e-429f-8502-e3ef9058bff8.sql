-- Fix infinite recursion in user_roles RLS by creating SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create new safe policies using the SECURITY DEFINER function
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.current_user_is_admin())
WITH CHECK (public.current_user_is_admin());

-- Add status column to community_profiles for user management
ALTER TABLE public.community_profiles 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_community_profiles_status ON public.community_profiles(status);

-- Add updated_by column to track who made changes
ALTER TABLE public.community_profiles 
ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id);

-- Create audit log table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_actions_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES auth.users(id),
  target_user_id uuid,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin actions log
ALTER TABLE public.admin_actions_log ENABLE ROW LEVEL SECURITY;

-- Only admins can access admin actions log
CREATE POLICY "Only admins can access admin actions log"
ON public.admin_actions_log
FOR ALL
TO authenticated
USING (public.current_user_is_admin())
WITH CHECK (public.current_user_is_admin());