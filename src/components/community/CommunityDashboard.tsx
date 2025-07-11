
import { useState } from "react";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useCommunityDashboard } from "@/hooks/useCommunityDashboard";
import WelcomeSection from "./WelcomeSection";
import QuickActions from "./QuickActions";
import RecentPostsSection from "./RecentPostsSection";
import CategoriesSection from "./CategoriesSection";
import RightSidebar from "./RightSidebar";


const CommunityDashboard = () => {
  const { user } = useCommunityAuth();
  const { categories } = useCommunityDashboard();
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso restrito
          </h2>
          <p className="text-gray-600">
            Você precisa estar logado para acessar a comunidade.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <WelcomeSection />
          <QuickActions 
            showCreateForm={showCreateForm} 
            setShowCreateForm={setShowCreateForm} 
          />
          <RecentPostsSection />
          <CategoriesSection categories={categories} />
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

    </div>
  );
};

export default CommunityDashboard;
