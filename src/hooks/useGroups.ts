
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCommunityProfile } from "./useCommunityProfile";
import { CommunityGroup, CreateGroupData } from "@/types/groups";
import { supabase } from "@/integrations/supabase/client";

export const useGroups = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [myGroups, setMyGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useCommunityProfile();

  const fetchGroupsData = async () => {
    if (!profile) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Buscar todos os grupos
      const { data: groupsData, error: groupsError } = await supabase
        .from('community_groups')
        .select(`
          *,
          creator:community_profiles!community_groups_created_by_fkey(display_name)
        `)
        .order('created_at', { ascending: false });

      if (groupsError) {
        console.error('Erro ao buscar grupos:', groupsError);
        throw groupsError;
      }

      // Buscar memberships do usuário atual
      const { data: memberships, error: membershipError } = await supabase
        .from('group_members')
        .select('group_id, role')
        .eq('profile_id', profile.id);

      if (membershipError) {
        console.error('Erro ao buscar memberships:', membershipError);
        throw membershipError;
      }

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

  const createGroupHandler = async (groupData: CreateGroupData): Promise<boolean> => {
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

      await fetchGroupsData();
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

  const joinGroupHandler = async (groupId: string): Promise<boolean> => {
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

      await fetchGroupsData();
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

  const leaveGroupHandler = async (groupId: string): Promise<boolean> => {
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

      await fetchGroupsData();
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
    fetchGroupsData();
  }, [profile]);

  return {
    groups,
    myGroups,
    loading,
    createGroup: createGroupHandler,
    joinGroup: joinGroupHandler,
    leaveGroup: leaveGroupHandler,
    refetch: fetchGroupsData
  };
};
