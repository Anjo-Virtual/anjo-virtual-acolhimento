
import { supabase } from "@/integrations/supabase/client";
import { CommunityGroup, CreateGroupData } from "@/types/groups";

export const fetchAllGroups = async (profileId: string) => {
  console.log('[groupService] Iniciando busca de grupos para profileId:', profileId);
  
  try {
    // Buscar todos os grupos primeiro
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

    if (!groupsData || groupsData.length === 0) {
      console.log('[groupService] Nenhum grupo encontrado');
      return {
        groups: [],
        myGroups: []
      };
    }

    // Buscar memberships do usuário
    const { data: memberships, error: membershipError } = await supabase
      .from('group_members')
      .select('group_id, role')
      .eq('profile_id', profileId);

    if (membershipError) {
      console.error('[groupService] Erro ao buscar memberships:', membershipError);
      // Continuar sem memberships se houver erro
    }

    console.log('[groupService] Memberships encontrados:', memberships?.length || 0);

    // Criar mapa de memberships
    const membershipMap = new Map(
      memberships?.map(m => [m.group_id, m.role]) || []
    );

    // Enriquecer grupos com informações de membership
    const enrichedGroups = groupsData.map(group => ({
      ...group,
      is_member: membershipMap.has(group.id),
      member_role: membershipMap.get(group.id)
    }));

    const myGroups = enrichedGroups.filter(g => g.is_member);

    console.log('[groupService] Processamento concluído:', {
      totalGroups: enrichedGroups.length,
      myGroups: myGroups.length
    });

    return {
      groups: enrichedGroups,
      myGroups: myGroups
    };
  } catch (error) {
    console.error('[groupService] Erro geral na busca de grupos:', error);
    return {
      groups: [],
      myGroups: []
    };
  }
};

export const createNewGroup = async (groupData: CreateGroupData, profileId: string) => {
  console.log('[groupService] Iniciando criação de grupo:', { groupData, profileId });
  
  try {
    // Criar o grupo SEM tentar adicionar o membro imediatamente
    const { data: newGroup, error: groupError } = await supabase
      .from('community_groups')
      .insert({
        name: groupData.name,
        description: groupData.description,
        is_private: groupData.is_private,
        max_members: groupData.max_members,
        created_by: profileId,
        current_members: 1 // Definir como 1 já que o criador é membro
      })
      .select()
      .single();

    if (groupError) {
      console.error('[groupService] Erro ao criar grupo:', groupError);
      throw groupError;
    }

    console.log('[groupService] Grupo criado com sucesso:', newGroup);

    // Tentar adicionar o criador como membro em uma operação separada
    // Se falhar, não quebrar a criação do grupo
    try {
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: newGroup.id,
          profile_id: profileId,
          role: 'admin'
        });

      if (memberError) {
        console.warn('[groupService] Aviso: Grupo criado mas erro ao adicionar membro:', memberError);
        // Não falhar aqui - o grupo foi criado com sucesso
      } else {
        console.log('[groupService] Criador adicionado como admin com sucesso');
      }
    } catch (memberAddError) {
      console.warn('[groupService] Erro não crítico ao adicionar membro:', memberAddError);
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
