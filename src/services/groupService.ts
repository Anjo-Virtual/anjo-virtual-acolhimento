
import { supabase } from "@/integrations/supabase/client";
import { CommunityGroup, CreateGroupData } from "@/types/groups";

export const fetchAllGroups = async (profileId: string) => {
  console.log('[groupService] Iniciando busca de grupos para profileId:', profileId);
  
  try {
    // Buscar todos os grupos com informações do criador
    const { data: groupsData, error: groupsError } = await supabase
      .from('community_groups')
      .select(`
        *,
        creator:community_profiles!community_groups_created_by_fkey(display_name)
      `)
      .order('created_at', { ascending: false });

    if (groupsError) {
      console.error('[groupService] Erro ao buscar grupos:', groupsError);
      throw groupsError;
    }

    console.log('[groupService] Grupos encontrados:', groupsData?.length || 0);

    // Buscar memberships do usuário atual
    const { data: memberships, error: membershipError } = await supabase
      .from('group_members')
      .select('group_id, role')
      .eq('profile_id', profileId);

    if (membershipError) {
      console.error('[groupService] Erro ao buscar memberships:', membershipError);
      // Continuar sem memberships se houver erro
    }

    console.log('[groupService] Memberships encontrados:', memberships?.length || 0);

    const membershipMap = new Map(
      memberships?.map(m => [m.group_id, m.role]) || []
    );

    const enrichedGroups = groupsData?.map(group => ({
      ...group,
      is_member: membershipMap.has(group.id),
      member_role: membershipMap.get(group.id)
    })) || [];

    const myGroups = enrichedGroups.filter(g => g.is_member);

    console.log('[groupService] Grupos processados - Total:', enrichedGroups.length, 'Meus grupos:', myGroups.length);

    return {
      groups: enrichedGroups,
      myGroups: myGroups
    };
  } catch (error) {
    console.error('[groupService] Erro geral na busca de grupos:', error);
    throw error;
  }
};

export const createNewGroup = async (groupData: CreateGroupData, profileId: string) => {
  console.log('[groupService] Iniciando criação de grupo:', { groupData, profileId });
  
  try {
    const { data: newGroup, error } = await supabase
      .from('community_groups')
      .insert({
        ...groupData,
        created_by: profileId,
        current_members: 1
      })
      .select()
      .single();

    if (error) {
      console.error('[groupService] Erro ao criar grupo:', error);
      throw error;
    }

    console.log('[groupService] Grupo criado:', newGroup);

    // Adicionar o criador como membro administrador
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: newGroup.id,
        profile_id: profileId,
        role: 'admin'
      });

    if (memberError) {
      console.error('[groupService] Erro ao adicionar criador como membro:', memberError);
      // Não falhar se não conseguir adicionar como membro
    } else {
      console.log('[groupService] Criador adicionado como admin do grupo');
    }

    return newGroup;
  } catch (error) {
    console.error('[groupService] Erro geral na criação do grupo:', error);
    throw error;
  }
};

export const joinExistingGroup = async (groupId: string, profileId: string) => {
  console.log('[groupService] Entrando no grupo:', { groupId, profileId });
  
  try {
    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        profile_id: profileId,
        role: 'member'
      });

    if (error) {
      console.error('[groupService] Erro ao entrar no grupo:', error);
      throw error;
    }

    console.log('[groupService] Entrou no grupo com sucesso');
  } catch (error) {
    console.error('[groupService] Erro geral ao entrar no grupo:', error);
    throw error;
  }
};

export const leaveExistingGroup = async (groupId: string, profileId: string) => {
  console.log('[groupService] Saindo do grupo:', { groupId, profileId });
  
  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('profile_id', profileId);

    if (error) {
      console.error('[groupService] Erro ao sair do grupo:', error);
      throw error;
    }

    console.log('[groupService] Saiu do grupo com sucesso');
  } catch (error) {
    console.error('[groupService] Erro geral ao sair do grupo:', error);
    throw error;
  }
};
