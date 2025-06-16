
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useToast } from "@/hooks/use-toast";

export interface PrivateMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    display_name: string;
  };
  recipient?: {
    display_name: string;
  };
}

export const usePrivateMessages = () => {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCommunityAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('private_messages')
        .select(`
          *,
          sender:community_profiles!sender_id(display_name),
          recipient:community_profiles!recipient_id(display_name)
        `)
        .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (recipientId: string, subject: string, content: string) => {
    if (!user) return false;

    try {
      const { data: profile } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return false;

      const { error } = await supabase
        .from('private_messages')
        .insert({
          sender_id: profile.id,
          recipient_id: recipientId,
          subject,
          content
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Mensagem enviada com sucesso!",
      });

      fetchMessages();
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
      return false;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('private_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    refetch: fetchMessages
  };
};
