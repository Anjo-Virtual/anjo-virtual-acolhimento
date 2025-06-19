
import { supabase } from "@/integrations/supabase/client";
import { CommunityGroup, CreateGroupData } from "@/types/groups";

export const fetchAllGroups = async (profileId: string) => {
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
    .eq('profile_id', profileId);

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

  return {
    groups: enrichedGroups,
    myGroups: enrichedGroups.filter(g => g.is_member)
  };
};

export const createNewGroup = async (groupData: CreateGroupData, profileId: string) => {
  const { data: newGroup, error } = await supabase
    .from('community_groups')
    .insert({
      ...groupData,
      created_by: profileId,
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
      profile_id: profileId,
      role: 'admin'
    });

  if (memberError) throw memberError;

  return newGroup;
};

export const joinExistingGroup = async (groupId: string, profileId: string) => {
  const { error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      profile_id: profileId,
      role: 'member'
    });

  if (error) throw error;
};

export const leaveExistingGroup = async (groupId: string, profileId: string) => {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('profile_id', profileId);

  if (error) throw error;
};
