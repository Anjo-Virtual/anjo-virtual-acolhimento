
import CommunityPageLayout from "@/components/community/CommunityPageLayout";
import CommunityDashboard from "@/components/community/CommunityDashboard";

const AuthenticatedCommunityView = () => {
  return (
    <CommunityPageLayout>
      <CommunityDashboard />
    </CommunityPageLayout>
  );
};

export default AuthenticatedCommunityView;
