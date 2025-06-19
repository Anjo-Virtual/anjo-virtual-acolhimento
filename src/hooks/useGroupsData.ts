
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCommunityProfile } from "./useCommunityProfile";
import { CommunityGroup } from "@/types/groups";
import { fetchGroups, createGroup, joinGroup, leaveGroup } from "@/services/groupsService";

export const useGroupsData = () => {
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
      const { groups: allGroups, myGroups: userGroups } = await fetchGroups(profile.id);
      setGroups(allGroups);
      setMyGroups(userGroups);
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

  const createGroupHandler = async (groupData: any): Promise<boolean> => {
    if (!profile) return false;

    try {
      await createGroup(groupData, profile.id);
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
      await joinGroup(groupId, profile.id);
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
      await leaveGroup(groupId, profile.id);
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
