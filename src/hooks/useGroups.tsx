
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCommunityProfile } from "./useCommunityProfile";

type CommunityGroup = {
  id: string;
  name: string;
  description: string;
  is_private: boolean;
  max_members: number;
  current_members: number;
  created_by: string;
  created_at: string;
  creator?: {
    display_name: string;
  };
  is_member?: boolean;
  member_role?: string;
};

export const useGroups = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [myGroups, setMyGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useCommunityProfile();

  const fetchGroups = async () => {
    try {
      // Buscar grupos públicos e grupos que o usuário é membro
      const { data: groupsData, error } = await supabase
        .from('community_groups')
        .select(`
          *,
          creator:community_profiles!community_groups_created_by_fkey(display_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Verificar quais grupos o usuário é membro
      const { data: memberships } = await supabase
        .from('group_members')
        .select('group_id, role')
        .eq('profile_id', profile?.id);

      const membershipMap = new Map(
        memberships?.map(m => [m.group_id, m.role]) || []
      );

      const enrichedGroups = groupsData?.map(group => ({
        ...group,
        is_member: membershipMap.has(group.id),
        member_role: membershipMap.get(group.id)
      })) || [];

      setGroups(enrichedGroups);
      setMyGroups(enrichedGroups.filter(g => g.is_member));
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os grupos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData: {
    name: string;
    description: string;
    is_private: boolean;
    max_members: number;
  }) => {
    if (!profile) return false;

    try {
      const { data: newGroup, error } = await supabase
        .from('community_groups')
        .insert({
          ...groupData,
          created_by: profile.id,
          current_members: 1
        })
        .select()
        .single();

      if (error) throw error;

      // Adicionar o criador como membro administrador
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: newGroup.id,
          profile_id: profile.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast({
        title: "Sucesso",
        description: "Grupo criado com sucesso!",
      });

      fetchGroups();
      return true;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o grupo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!profile) return false;

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          profile_id: profile.id,
          role: 'member'
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Você entrou no grupo!",
      });

      fetchGroups();
      return true;
    } catch (error) {
      console.error('Erro ao entrar no grupo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível entrar no grupo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!profile) return false;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('profile_id', profile.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Você saiu do grupo.",
      });

      fetchGroups();
      return true;
    } catch (error) {
      console.error('Erro ao sair do grupo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível sair do grupo.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (profile) {
      fetchGroups();
    }
  }, [profile]);

  return {
    groups,
    myGroups,
    loading,
    createGroup,
    joinGroup,
    leaveGroup,
    refetch: fetchGroups
  };
};
