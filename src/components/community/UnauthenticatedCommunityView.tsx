
import CommunityHeader from "./CommunityHeader";
import CommunityBenefits from "./CommunityBenefits";
import CommunityCallToAction from "./CommunityCallToAction";
import CommunityPreview from "./CommunityPreview";

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
};

interface UnauthenticatedCommunityViewProps {
  categories: ForumCategory[];
}

const UnauthenticatedCommunityView = ({ categories }: UnauthenticatedCommunityViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <CommunityHeader isLoggedIn={false} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <CommunityBenefits />
          <CommunityCallToAction />
          <CommunityPreview categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default UnauthenticatedCommunityView;
