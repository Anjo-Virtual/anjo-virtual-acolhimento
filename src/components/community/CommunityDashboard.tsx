
import { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import QuickActions from "./QuickActions";
import CategoriesSection from "./CategoriesSection";
import RecentPostsSection from "./RecentPostsSection";
import CreatePostForm from "./CreatePostForm";
import { useCommunityDashboard } from "@/hooks/useCommunityDashboard";

const CommunityDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { categories } = useCommunityDashboard();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <WelcomeSection />
      
      <QuickActions 
        showCreateForm={showCreateForm}
        setShowCreateForm={setShowCreateForm}
      />

      {showCreateForm && (
        <CreatePostForm onSuccess={() => setShowCreateForm(false)} />
      )}

      <CategoriesSection categories={categories} />

      <RecentPostsSection />
    </div>
  );
};

export default CommunityDashboard;
