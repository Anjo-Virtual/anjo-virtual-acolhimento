-- Security hardening migration
-- 1) chat_history: add user_id, trigger to auto-fill, RLS policies

-- Add column for ownership if missing
ALTER TABLE public.chat_history
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id
  ON public.chat_history(user_id);

-- Ensure RLS enabled (safe if already enabled)
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Trigger function to auto-set user_id from auth
CREATE OR REPLACE FUNCTION public.set_user_id_from_auth()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$function$;

-- Create trigger only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_chat_history_user_id'
  ) THEN
    CREATE TRIGGER set_chat_history_user_id
    BEFORE INSERT ON public.chat_history
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_id_from_auth();
  END IF;
END $$;

-- Policies: user can manage own rows, admins full access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='chat_history' AND policyname='Chat history: users manage own'
  ) THEN
    CREATE POLICY "Chat history: users manage own"
    ON public.chat_history
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='chat_history' AND policyname='Chat history: admins full access'
  ) THEN
    CREATE POLICY "Chat history: admins full access"
    ON public.chat_history
    FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END $$;

-- 2) Harden SECURITY DEFINER functions by setting explicit search_path
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT id FROM public.community_profiles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.user_has_liked_post(user_uuid uuid, post_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
      SELECT 1 
      FROM public.forum_post_likes 
      WHERE user_id = user_uuid 
      AND post_id = post_uuid
  );
$function$;