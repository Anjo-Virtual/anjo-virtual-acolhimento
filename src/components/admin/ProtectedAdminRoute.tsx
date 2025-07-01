
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LoadingSpinner } from "@/components/admin/auth/LoadingSpinner";
import { useMemo } from "react";

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAdminAuth();
  const location = useLocation();
  
  // Memoizar o estado de autenticação para evitar re-renders desnecessários
  const authState = useMemo(() => ({
    isAuthenticated: !!user,
    hasAdminRole: isAdmin,
    isLoading: loading
  }), [user, isAdmin, loading]);
  
  console.log("ProtectedAdminRoute - Estado otimizado:", {
    path: location.pathname,
    ...authState
  });
  
  // Mostrar loading apenas quando realmente necessário
  if (authState.isLoading) {
    return <LoadingSpinner message="Verificando permissões..." />;
  }
  
  // Redirecionamento seguro com estado para evitar loops
  if (!authState.isAuthenticated || !authState.hasAdminRole) {
    console.log("ProtectedAdminRoute - Redirecionando para login");
    return (
      <Navigate 
        to="/admin/login" 
        state={{ from: location, reason: !authState.isAuthenticated ? 'unauthenticated' : 'unauthorized' }} 
        replace 
      />
    );
  }
  
  return <>{children}</>;
};
