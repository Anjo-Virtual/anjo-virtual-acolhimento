
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useCommunityDashboard } from "@/hooks/useCommunityDashboard";
import UnauthenticatedCommunityView from "@/components/community/UnauthenticatedCommunityView";
import AuthenticatedCommunityView from "@/components/community/AuthenticatedCommunityView";

const Community = () => {
  const { user } = useCommunityAuth();
  const { categories } = useCommunityDashboard();

  if (!user) {
    return <UnauthenticatedCommunityView categories={categories} />;
  }

  return <AuthenticatedCommunityView />;
};

export default Community;
