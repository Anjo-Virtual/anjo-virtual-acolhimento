
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";

interface CommunityPageLayoutProps {
  children: React.ReactNode;
}

const CommunityPageLayout = ({ children }: CommunityPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader />
      
      <div className="flex">
        <CommunitySidebar />
        <main className="flex-1 p-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CommunityPageLayout;
