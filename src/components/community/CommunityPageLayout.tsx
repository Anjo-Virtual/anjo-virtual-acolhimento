
import { useState } from "react";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/useMobile";

interface CommunityPageLayoutProps {
  children: React.ReactNode;
}

const CommunityPageLayout = ({ children }: CommunityPageLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${isMobile ? 'fixed z-50' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}>
          <CommunitySidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 pt-20">
          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="p-4 border-b bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                Menu
              </Button>
            </div>
          )}
          
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommunityPageLayout;
