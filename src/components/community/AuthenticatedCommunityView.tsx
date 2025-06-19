
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import CommunityDashboard from "@/components/community/CommunityDashboard";

const AuthenticatedCommunityView = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader />
      
      <div className="flex">
        <CommunitySidebar />
        <main className="flex-1">
          <CommunityDashboard />
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedCommunityView;
