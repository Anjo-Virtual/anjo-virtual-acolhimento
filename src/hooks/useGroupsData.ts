
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCommunityProfile } from "./useCommunityProfile";
import { CommunityGroup, CreateGroupData } from "@/types/groups";
import { 
  fetchAllGroups, 
  createNewGroup, 
  joinExistingGroup, 
  leaveExistingGroup 
} from "@/services/groupService";

export const useGroupsData = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [myGroups, setMyGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile } = useCommunityProfile();

  const fetchGroupsData = async () => {
    if (!profile) {
      console.log('[useGroupsData] Perfil não disponível, parando busca');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('[useGroupsData] Iniciando busca de grupos para perfil:', profile.id);
      
      const result = await fetchAllGroups(profile.id);
      
      setGroups(result.groups);
      setMyGroups(result.myGroups);
      
      console.log('[useGroupsData] Dados carregados:', {
        totalGroups: result.groups.length,
        myGroups: result.myGroups.length
      });
      
    } catch (error: any) {
      console.error('[useGroupsData] Erro ao carregar grupos:', error);
      setError(error.message || 'Erro ao carregar grupos');
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
    if (!profile) {
      console.error('[useGroupsData] Perfil não disponível para criar grupo');
      toast({
        title: "Erro",
        description: "Perfil não encontrado. Faça login novamente.",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('[useGroupsData] Tentando criar grupo:', groupData);
      
      const newGroup = await createNewGroup(groupData, profile.id);
      
      console.log('[useGroupsData] Grupo criado:', newGroup);
      
      toast({
        title: "Sucesso",
        description: "Grupo criado com sucesso!",
      });
      
      // Recarregar dados após criação
      await fetchGroupsData();
      return true;
    } catch (error: any) {
      console.error('[useGroupsData] Erro ao criar grupo:', error);
      
      // Mostrar erro mais específico se possível
      let errorMessage = "Não foi possível criar o grupo.";
      if (error.message?.includes('recursion')) {
        errorMessage = "Erro interno no sistema. Tente novamente em alguns instantes.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const joinGroupHandler = async (groupId: string): Promise<boolean> => {
    if (!profile) {
      console.error('[useGroupsData] Perfil não disponível para entrar no grupo');
      return false;
    }

    try {
      await joinExistingGroup(groupId, profile.id);
      toast({
        title: "Sucesso",
        description: "Você entrou no grupo!",
      });
      await fetchGroupsData();
      return true;
    } catch (error: any) {
      console.error('[useGroupsData] Erro ao entrar no grupo:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível entrar no grupo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const leaveGroupHandler = async (groupId: string): Promise<boolean> => {
    if (!profile) {
      console.error('[useGroupsData] Perfil não disponível para sair do grupo');
      return false;
    }

    try {
      await leaveExistingGroup(groupId, profile.id);
      toast({
        title: "Sucesso",
        description: "Você saiu do grupo.",
      });
      await fetchGroupsData();
      return true;
    } catch (error: any) {
      console.error('[useGroupsData] Erro ao sair do grupo:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível sair do grupo.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('[useGroupsData] Profile changed, fetching groups data');
    fetchGroupsData();
  }, [profile]);

  return {
    groups,
    myGroups,
    loading,
    error,
    createGroup: createGroupHandler,
    joinGroup: joinGroupHandler,
    leaveGroup: leaveGroupHandler,
    refetch: fetchGroupsData
  };
};
