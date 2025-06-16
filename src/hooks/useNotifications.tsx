
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: 'reply' | 'like' | 'mention' | 'event' | 'message' | 'group';
  title: string;
  message: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useCommunityAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', profile.id)
        .eq('is_read', false);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas!",
      });

      fetchNotifications();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};
