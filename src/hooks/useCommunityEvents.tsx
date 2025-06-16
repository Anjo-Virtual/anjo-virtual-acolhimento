
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useToast } from "@/hooks/use-toast";

export interface CommunityEvent {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  event_date: string;
  end_date?: string;
  location?: string;
  is_online: boolean;
  max_participants?: number;
  current_participants: number;
  is_active: boolean;
  created_at: string;
  organizer?: {
    display_name: string;
  };
}

export const useCommunityEvents = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCommunityAuth();
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('community_events')
        .select(`
          *,
          organizer:community_profiles!organizer_id(display_name)
        `)
        .eq('is_active', true)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: {
    title: string;
    description?: string;
    event_date: string;
    end_date?: string;
    location?: string;
    is_online: boolean;
    max_participants?: number;
  }) => {
    if (!user) return false;

    try {
      const { data: profile } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return false;

      const { error } = await supabase
        .from('community_events')
        .insert({
          ...eventData,
          organizer_id: profile.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso!",
      });

      fetchEvents();
      return true;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento.",
        variant: "destructive",
      });
      return false;
    }
  };

  const joinEvent = async (eventId: string) => {
    if (!user) return false;

    try {
      const { data: profile } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return false;

      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          participant_id: profile.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Você se inscreveu no evento!",
      });

      fetchEvents();
      return true;
    } catch (error) {
      console.error('Erro ao participar do evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível se inscrever no evento.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    createEvent,
    joinEvent,
    refetch: fetchEvents
  };
};
