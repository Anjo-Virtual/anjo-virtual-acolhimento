
export type CommunityGroup = {
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

export type CreateGroupData = {
  name: string;
  description: string;
  is_private: boolean;
  max_members: number;
};
