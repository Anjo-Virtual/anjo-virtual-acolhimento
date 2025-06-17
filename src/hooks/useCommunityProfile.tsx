
import { useState, useEffect } from "react";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type CommunityProfile = {
  id: string;
  display_name: string;
  bio: string;
  is_anonymous: boolean;
  user_id: string;
};

export const useCommunityProfile = () => {
  const { user } = useCommunityAuth();
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchOrCreateProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchOrCreateProfile = async () => {
    if (!user) return;
    
    try {
      // Tentar buscar perfil existente
      let { data: existingProfile, error: fetchError } = await supabase
        .from('community_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingProfile) {
        // Criar perfil se não existir
        const { data: newProfile, error: createError } = await supabase
          .from('community_profiles')
          .insert({
            user_id: user.id,
            display_name: user.email?.split('@')[0] || 'Membro Anônimo',
            bio: '',
            is_anonymous: true
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(existingProfile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil da comunidade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seu perfil da comunidade.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, refetch: fetchOrCreateProfile };
};
