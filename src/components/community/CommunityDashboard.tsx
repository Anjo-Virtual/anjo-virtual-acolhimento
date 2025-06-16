
import FeedHeader from "./FeedHeader";
import RightSidebar from "./RightSidebar";
import SimplifiedWelcome from "./SimplifiedWelcome";
import RecentPostsSection from "./RecentPostsSection";

const CommunityDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Feed Central */}
      <div className="flex-1">
        <FeedHeader />
        
        <div className="p-6">
          <SimplifiedWelcome />
          <RecentPostsSection />
        </div>
      </div>

      {/* Sidebar Direita */}
      <RightSidebar />
    </div>
  );
};

export default CommunityDashboard;
