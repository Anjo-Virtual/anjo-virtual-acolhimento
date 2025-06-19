
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useCommunityDashboard } from "@/hooks/useCommunityDashboard";
import UnauthenticatedCommunityView from "@/components/community/UnauthenticatedCommunityView";
import AuthenticatedCommunityView from "@/components/community/AuthenticatedCommunityView";

const Community = () => {
  const { user } = useCommunityAuth();
  const { categories } = useCommunityDashboard();

  // Transform categories to match the expected type for UnauthenticatedCommunityView
  const transformedCategories = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.slug,
    color: category.color,
    icon: 'MessageSquare', // Default icon for all categories
    sort_order: 0 // Default sort order
  }));

  if (!user) {
    return <UnauthenticatedCommunityView categories={transformedCategories} />;
  }

  return <AuthenticatedCommunityView />;
};

export default Community;
