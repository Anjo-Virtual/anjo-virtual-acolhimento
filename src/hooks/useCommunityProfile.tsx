
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
    
    console.log('[useCommunityProfile] Iniciando busca/criação do perfil para usuário:', user.id);
    
    try {
      // Primeiro, tentar usar a função de debug para verificar o perfil
      const { data: debugData, error: debugError } = await supabase
        .rpc('debug_user_profile', { user_uuid: user.id });

      console.log('[useCommunityProfile] Debug do perfil:', { debugData, debugError });

      // Tentar buscar perfil existente
      let { data: existingProfile, error: fetchError } = await supabase
        .from('community_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('[useCommunityProfile] Perfil existente:', { existingProfile, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('[useCommunityProfile] Erro ao buscar perfil:', fetchError);
        throw fetchError;
      }

      if (!existingProfile) {
        console.log('[useCommunityProfile] Criando novo perfil...');
        // Criar perfil se não existir
        const newProfileData = {
          user_id: user.id,
          display_name: user.email?.split('@')[0] || 'Membro Anônimo',
          bio: '',
          is_anonymous: true
        };

        console.log('[useCommunityProfile] Dados do novo perfil:', newProfileData);

        const { data: newProfile, error: createError } = await supabase
          .from('community_profiles')
          .insert(newProfileData)
          .select()
          .single();

        console.log('[useCommunityProfile] Resultado da criação:', { newProfile, createError });

        if (createError) {
          console.error('[useCommunityProfile] Erro ao criar perfil:', createError);
          throw createError;
        }
        
        console.log('[useCommunityProfile] Perfil criado com sucesso:', newProfile);
        setProfile(newProfile);
      } else {
        console.log('[useCommunityProfile] Usando perfil existente:', existingProfile);
        setProfile(existingProfile);
      }
    } catch (error) {
      console.error('[useCommunityProfile] Erro geral:', error);
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
