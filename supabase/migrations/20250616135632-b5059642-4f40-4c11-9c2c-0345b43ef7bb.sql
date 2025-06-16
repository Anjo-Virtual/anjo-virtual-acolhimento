
-- Criar tabela para mensagens privadas entre usuários
CREATE TABLE public.private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.community_profiles(id) NOT NULL,
  recipient_id UUID REFERENCES public.community_profiles(id) NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para eventos da comunidade
CREATE TABLE public.community_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.community_profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  is_online BOOLEAN DEFAULT TRUE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para participações em eventos
CREATE TABLE public.event_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.community_events(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES public.community_profiles(id) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, participant_id)
);

-- Criar tabela para posts salvos
CREATE TABLE public.saved_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.community_profiles(id) NOT NULL,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Criar tabela para notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.community_profiles(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reply', 'like', 'mention', 'event', 'message', 'group')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID, -- ID relacionado (post, event, etc)
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para mensagens privadas
CREATE POLICY "Users can view their own messages" ON public.private_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = sender_id AND user_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = recipient_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages" ON public.private_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = sender_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their received messages" ON public.private_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = recipient_id AND user_id = auth.uid()
    )
  );

-- Políticas para eventos
CREATE POLICY "Anyone can view active events" ON public.community_events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create events" ON public.community_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update their events" ON public.community_events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

-- Políticas para participações em eventos
CREATE POLICY "Anyone can view event participants" ON public.event_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join events" ON public.event_participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = participant_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can leave events" ON public.event_participants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = participant_id AND user_id = auth.uid()
    )
  );

-- Políticas para posts salvos
CREATE POLICY "Users can view their saved posts" ON public.saved_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = user_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can save posts" ON public.saved_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = user_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove saved posts" ON public.saved_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = user_id AND user_id = auth.uid()
    )
  );

-- Políticas para notificações
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = user_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.community_profiles 
      WHERE id = user_id AND user_id = auth.uid()
    )
  );

-- Trigger para atualizar contador de participantes em eventos
CREATE OR REPLACE FUNCTION update_event_participant_count()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_participant_count
  AFTER INSERT OR DELETE ON public.event_participants
  FOR EACH ROW EXECUTE FUNCTION update_event_participant_count();

-- Trigger para atualizar updated_at
CREATE TRIGGER trigger_update_private_messages_updated_at
  BEFORE UPDATE ON public.private_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_community_events_updated_at
  BEFORE UPDATE ON public.community_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
