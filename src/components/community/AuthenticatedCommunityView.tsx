
import { CommunityLayout } from "@/components/community/CommunityLayout";
import { CommunityDashboard } from "@/components/community/CommunityDashboard";

const AuthenticatedCommunityView = () => {
  return (
    <CommunityLayout>
      <CommunityDashboard />
    </CommunityLayout>
  );
};

export default AuthenticatedCommunityView;
