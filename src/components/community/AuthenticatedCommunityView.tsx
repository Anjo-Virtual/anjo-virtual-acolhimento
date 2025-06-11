
import CommunityHeader from "./CommunityHeader";
import CommunitySidebar from "./CommunitySidebar";
import CommunityDashboard from "./CommunityDashboard";

const AuthenticatedCommunityView = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader isLoggedIn={true} />
      
      <div className="flex">
        <CommunitySidebar />
        <main className="flex-1 p-6">
          <CommunityDashboard />
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedCommunityView;
