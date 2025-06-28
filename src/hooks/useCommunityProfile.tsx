
import { useState, useEffect, useRef } from "react";
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
  const fetchAttempted = useRef(false);

  useEffect(() => {
    if (user && !fetchAttempted.current) {
      fetchAttempted.current = true;
      fetchOrCreateProfile();
    } else if (!user) {
      setProfile(null);
      setLoading(false);
      fetchAttempted.current = false;
    }
  }, [user]);

  const fetchOrCreateProfile = async () => {
    if (!user) return;
    
    console.log('[useCommunityProfile] Iniciando busca/criação do perfil para usuário:', user.id);
    
    try {
      // Tentar buscar perfil existente
      let { data: existingProfile, error: fetchError } = await supabase
        .from('community_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('[useCommunityProfile] Erro ao buscar perfil:', fetchError);
        throw fetchError;
      }

      if (!existingProfile) {
        console.log('[useCommunityProfile] Criando novo perfil...');
        const newProfileData = {
          user_id: user.id,
          display_name: user.email?.split('@')[0] || 'Membro Anônimo',
          bio: '',
          is_anonymous: true
        };

        const { data: newProfile, error: createError } = await supabase
          .from('community_profiles')
          .insert(newProfileData)
          .select()
          .single();

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
      // Não bloquear a interface com erros de perfil
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, refetch: fetchOrCreateProfile };
};
