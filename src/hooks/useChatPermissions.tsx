
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export const useChatPermissions = () => {
  const { user: communityUser } = useCommunityAuth();
  const { user: adminUser, isAdmin } = useAdminAuth();

  // Usuário atual (pode ser community ou admin)
  const currentUser = adminUser || communityUser;
  
  // Se é admin logado no painel admin
  const isAdminUser = isAdmin && adminUser;
  
  // Se é usuário comum da comunidade
  const isCommunityUser = !isAdmin && communityUser;

  return {
    currentUser,
    isAdminUser,
    isCommunityUser,
    canViewAllConversations: isAdminUser,
    canViewAllLeads: isAdminUser,
    canManageConversations: isAdminUser,
    userId: currentUser?.id
  };
};
