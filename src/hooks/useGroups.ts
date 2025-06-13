
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCommunityProfile } from "./useCommunityProfile";
import { CommunityGroup, CreateGroupData } from "@/types/groups";
import * as groupsService from "@/services/groupsService";

export const useGroups = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [myGroups, setMyGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useCommunityProfile();

  const fetchGroupsData = async () => {
    if (!profile) return;

    try {
      const { groups: allGroups, myGroups: userGroups } = await groupsService.fetchGroups(profile.id);
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

  const createGroupHandler = async (groupData: CreateGroupData): Promise<boolean> => {
    if (!profile) return false;

    try {
      await groupsService.createGroup(groupData, profile.id);
      
      toast({
        title: "Sucesso",
        description: "Grupo criado com sucesso!",
      });

      fetchGroupsData();
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
      await groupsService.joinGroup(groupId, profile.id);
      
      toast({
        title: "Sucesso",
        description: "Você entrou no grupo!",
      });

      fetchGroupsData();
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
      await groupsService.leaveGroup(groupId, profile.id);
      
      toast({
        title: "Sucesso",
        description: "Você saiu do grupo.",
      });

      fetchGroupsData();
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
      fetchGroupsData();
    }
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
