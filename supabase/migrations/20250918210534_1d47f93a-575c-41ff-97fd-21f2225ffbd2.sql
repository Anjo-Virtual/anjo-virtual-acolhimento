-- Enable Row Level Security on the site_settings table
-- This critical security fix ensures that sensitive configuration data 
-- (API keys, webhook URLs, phone numbers) is only accessible to administrators

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Verify that the existing policies are sufficient
-- The table already has the policy "Only admins can access site settings" 
-- which restricts all operations (SELECT, INSERT, UPDATE, DELETE) to users 
-- where is_admin(auth.uid()) returns true