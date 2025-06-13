
import { supabase } from "@/integrations/supabase/client";
import { CommunityGroup, CreateGroupData } from "@/types/groups";

export const fetchGroups = async (profileId: string): Promise<{
  groups: CommunityGroup[];
  myGroups: CommunityGroup[];
}> => {
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
    .eq('profile_id', profileId);

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

export const createGroup = async (
  groupData: CreateGroupData,
  profileId: string
): Promise<void> => {
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
};

export const joinGroup = async (
  groupId: string,
  profileId: string
): Promise<void> => {
  const { error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      profile_id: profileId,
      role: 'member'
    });

  if (error) throw error;
};

export const leaveGroup = async (
  groupId: string,
  profileId: string
): Promise<void> => {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('profile_id', profileId);

  if (error) throw error;
};
