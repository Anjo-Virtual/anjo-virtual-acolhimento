
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LoadingSpinner } from "@/components/admin/auth/LoadingSpinner";

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAdminAuth();
  const location = useLocation();
  
  console.log("ProtectedAdminRoute - Estado:", { user: user?.email, loading, isAdmin });
  
  if (loading) {
    console.log("ProtectedAdminRoute - Mostrando loading...");
    return <LoadingSpinner message="Verificando permissões..." />;
  }
  
  if (!user || !isAdmin) {
    console.log("ProtectedAdminRoute - Redirecionando para login");
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  console.log("ProtectedAdminRoute - Acesso permitido");
  return <>{children}</>;
};
