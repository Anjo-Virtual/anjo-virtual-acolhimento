
import { ReactNode } from "react";

interface CommunityLayoutProps {
  children: ReactNode;
}

const CommunityLayout = ({ children }: CommunityLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

export default CommunityLayout;
