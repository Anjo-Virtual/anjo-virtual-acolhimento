
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useCommunityCategories } from "@/hooks/useCommunityCategories";
import UnauthenticatedCommunityView from "@/components/community/UnauthenticatedCommunityView";
import AuthenticatedCommunityView from "@/components/community/AuthenticatedCommunityView";

const Community = () => {
  const { user } = useCommunityAuth();
  const { categories, loading } = useCommunityCategories();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <UnauthenticatedCommunityView categories={categories} />;
  }

  return <AuthenticatedCommunityView />;
};

export default Community;
