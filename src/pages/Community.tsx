
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import UnauthenticatedCommunityView from "@/components/community/UnauthenticatedCommunityView";
import AuthenticatedCommunityView from "@/components/community/AuthenticatedCommunityView";

const Community = () => {
  const { user } = useCommunityAuth();

  if (!user) {
    return <UnauthenticatedCommunityView />;
  }

  return <AuthenticatedCommunityView />;
};

export default Community;
