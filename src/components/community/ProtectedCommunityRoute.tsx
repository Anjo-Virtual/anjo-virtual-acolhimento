
import { Navigate, useLocation } from "react-router-dom";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";

export const ProtectedCommunityRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useCommunityAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/comunidade/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};
