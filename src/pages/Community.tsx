
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useCommunityDashboard } from "@/hooks/useCommunityDashboard";
import UnauthenticatedCommunityView from "@/components/community/UnauthenticatedCommunityView";
import AuthenticatedCommunityView from "@/components/community/AuthenticatedCommunityView";

const Community = () => {
  const { user } = useCommunityAuth();
  const { categories } = useCommunityDashboard();

  // Transform categories to match the expected type for UnauthenticatedCommunityView
  const transformedCategories = categories.map(category => ({
    ...category,
    icon: category.icon || 'MessageSquare',
    sort_order: category.sort_order || 0
  }));

  if (!user) {
    return <UnauthenticatedCommunityView categories={transformedCategories} />;
  }

  return <AuthenticatedCommunityView />;
};

export default Community;
