-- Security hardening migration
-- 1) chat_history: add user_id and lock down policies
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);

-- Drop overly permissive policies if they exist
DROP POLICY IF EXISTS "Anyone can create chat history" ON public.chat_history;
DROP POLICY IF EXISTS "Anyone can read chat history" ON public.chat_history;

-- Enable RLS (safe even if already enabled)
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- New strict policies
CREATE POLICY IF NOT EXISTS "Users can read own chat history or admins"
ON public.chat_history FOR SELECT
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY IF NOT EXISTS "Users can insert their own chat history"
ON public.chat_history FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update own chat history"
ON public.chat_history FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can delete own chat history"
ON public.chat_history FOR DELETE
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));


-- 2) integrations: keep admin-only, remove authenticated-* policies
DROP POLICY IF EXISTS "Authenticated users can delete integrations" ON public.integrations;
DROP POLICY IF EXISTS "Authenticated users can insert integrations" ON public.integrations;
DROP POLICY IF EXISTS "Authenticated users can read integrations" ON public.integrations;
DROP POLICY IF EXISTS "Authenticated users can update integrations" ON public.integrations;
-- Ensure admin-only policy exists (already present per schema)


-- 3) chat_prompts: admin manage, public read active
DROP POLICY IF EXISTS "Authenticated users can delete prompts" ON public.chat_prompts;
DROP POLICY IF EXISTS "Authenticated users can insert prompts" ON public.chat_prompts;
DROP POLICY IF EXISTS "Authenticated users can update prompts" ON public.chat_prompts;
-- Keep: "Anyone can read active prompts" and admin-only manage policies


-- 4) marketing_config: restrict to admins
DROP POLICY IF EXISTS "Authenticated users can manage marketing configs" ON public.marketing_config;
DROP POLICY IF EXISTS "Authenticated users can read marketing configs" ON public.marketing_config;

CREATE POLICY IF NOT EXISTS "Admins can manage marketing configs"
ON public.marketing_config FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY IF NOT EXISTS "Admins can read marketing configs"
ON public.marketing_config FOR SELECT
USING (public.is_admin(auth.uid()));


-- 5) subscribers: tighten UPDATE policy
DROP POLICY IF EXISTS update_own_subscription ON public.subscribers;

CREATE POLICY IF NOT EXISTS "Users can update their own subscription"
ON public.subscribers FOR UPDATE
USING ((user_id = auth.uid()) OR (email = auth.email()))
WITH CHECK ((user_id = auth.uid()) OR (email = auth.email()));

-- keep existing insert/select policies


-- 6) community_groups: remove permissive policies and tighten update
DROP POLICY IF EXISTS anyone_can_read_groups ON public.community_groups;
DROP POLICY IF EXISTS authenticated_can_update_groups ON public.community_groups;

CREATE POLICY IF NOT EXISTS "Group owners or admins can update groups"
ON public.community_groups FOR UPDATE
USING (
  (created_by IN (
    SELECT cp.id FROM public.community_profiles cp WHERE cp.user_id = auth.uid()
  )) OR public.is_admin(auth.uid())
);


-- 7) group_members: remove permissive policies, add strict ones
DROP POLICY IF EXISTS anyone_can_read_members ON public.group_members;
DROP POLICY IF EXISTS authenticated_can_join_groups ON public.group_members;
DROP POLICY IF EXISTS authenticated_can_leave_groups ON public.group_members;

CREATE POLICY IF NOT EXISTS "Users can add themselves to groups"
ON public.group_members FOR INSERT
WITH CHECK (
  profile_id IN (SELECT cp.id FROM public.community_profiles cp WHERE cp.user_id = auth.uid())
);

CREATE POLICY IF NOT EXISTS "Group owners or admins can manage group members"
ON public.group_members FOR ALL
USING (
  (group_id IN (
    SELECT cg.id FROM public.community_groups cg
    WHERE cg.created_by IN (SELECT cp.id FROM public.community_profiles cp WHERE cp.user_id = auth.uid())
  )) OR public.is_admin(auth.uid())
)
WITH CHECK (
  (group_id IN (
    SELECT cg.id FROM public.community_groups cg
    WHERE cg.created_by IN (SELECT cp.id FROM public.community_profiles cp WHERE cp.user_id = auth.uid())
  )) OR public.is_admin(auth.uid())
);


-- 8) forum_posts/comments: drop duplicate permissive insert policies
DROP POLICY IF EXISTS "Usuários autenticados podem criar posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Usuários autenticados podem criar comentários" ON public.forum_comments;


-- 9) notifications: fix incorrect policies
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;

CREATE POLICY IF NOT EXISTS "Users can view their notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY IF NOT EXISTS "Users can update their notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));


-- 10) saved_posts: correct ownership policies
DROP POLICY IF EXISTS "Users can remove saved posts" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can save posts" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can view their saved posts" ON public.saved_posts;

CREATE POLICY IF NOT EXISTS "Users can view their saved posts"
ON public.saved_posts FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can save posts (own)"
ON public.saved_posts FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can remove their saved posts"
ON public.saved_posts FOR DELETE
USING (user_id = auth.uid());


-- 11) Harden SECURITY DEFINER functions by setting search_path
-- has_role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid uuid, role_name user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = user_uuid AND role = role_name
  );
$function$;

-- is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'super_admin')
  );
$function$;

-- current_user_is_admin
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$function$;

-- validate_whatsapp_config
CREATE OR REPLACE FUNCTION public.validate_whatsapp_config(config jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF config ? 'destination_number' AND 
     config->>'destination_number' ~ '^[0-9]{10,15}$' THEN
    RETURN true;
  END IF;
  RETURN false;
END;
$function$;

-- debug_user_profile
CREATE OR REPLACE FUNCTION public.debug_user_profile(user_uuid uuid DEFAULT auth.uid())
RETURNS TABLE(profile_exists boolean, profile_id uuid, display_name text, user_id uuid)
LANGUAGE sql
SECURITY DEFINER SET search_path TO 'public'
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

-- search_knowledge_base
CREATE OR REPLACE FUNCTION public.search_knowledge_base(search_query text, limit_results integer DEFAULT 5)
RETURNS TABLE(id uuid, document_id uuid, chunk_text text, chunk_index integer, document_name text, similarity_score real)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path TO 'public'
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

-- handle_new_user_role
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'community_member');
  RETURN NEW;
END;
$function$;
