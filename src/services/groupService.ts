
import { supabase } from "@/integrations/supabase/client";
import { CommunityGroup, CreateGroupData } from "@/types/groups";

export const fetchAllGroups = async (profileId: string) => {
  console.log('Buscando grupos para profileId:', profileId);
  
  // Buscar todos os grupos com informações do criador
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

  console.log('Grupos encontrados:', groupsData);

  // Buscar memberships de forma separada para evitar recursão
  const { data: memberships, error: membershipError } = await supabase
    .from('group_members')
    .select('group_id, role')
    .eq('profile_id', profileId);

  console.log('Memberships encontrados:', memberships);

  if (membershipError) {
    console.error('Erro ao buscar memberships:', membershipError);
    // Não quebrar se não conseguir buscar memberships
    const enrichedGroups = groupsData?.map(group => ({
      ...group,
      is_member: false,
      member_role: undefined
    })) || [];

    return {
      groups: enrichedGroups,
      myGroups: []
    };
  }

  const membershipMap = new Map(
    memberships?.map(m => [m.group_id, m.role]) || []
  );

  const enrichedGroups = groupsData?.map(group => ({
    ...group,
    is_member: membershipMap.has(group.id),
    member_role: membershipMap.get(group.id)
  })) || [];

  console.log('Grupos enriquecidos:', enrichedGroups);

  return {
    groups: enrichedGroups,
    myGroups: enrichedGroups.filter(g => g.is_member)
  };
};

export const createNewGroup = async (groupData: CreateGroupData, profileId: string) => {
  console.log('Criando grupo:', groupData, 'para profile:', profileId);
  
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
    console.error('Erro ao criar grupo:', error);
    throw error;
  }

  console.log('Grupo criado:', newGroup);

  // Adicionar o criador como membro administrador
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({
      group_id: newGroup.id,
      profile_id: profileId,
      role: 'admin'
    });

  if (memberError) {
    console.error('Erro ao adicionar criador como membro:', memberError);
    throw memberError;
  }

  console.log('Criador adicionado como membro admin');

  return newGroup;
};

export const joinExistingGroup = async (groupId: string, profileId: string) => {
  console.log('Entrando no grupo:', groupId, 'profile:', profileId);
  
  const { error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      profile_id: profileId,
      role: 'member'
    });

  if (error) {
    console.error('Erro ao entrar no grupo:', error);
    throw error;
  }

  console.log('Entrou no grupo com sucesso');
};

export const leaveExistingGroup = async (groupId: string, profileId: string) => {
  console.log('Saindo do grupo:', groupId, 'profile:', profileId);
  
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('profile_id', profileId);

  if (error) {
    console.error('Erro ao sair do grupo:', error);
    throw error;
  }

  console.log('Saiu do grupo com sucesso');
};
