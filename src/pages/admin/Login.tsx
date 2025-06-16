
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LoadingSpinner } from "@/components/admin/auth/LoadingSpinner";
import { AdminLoginCard } from "@/components/admin/auth/AdminLoginCard";

const AdminLogin = () => {
  const { signIn, signUp, signOut, user, loading, isAdmin } = useAdminAuth();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/admin";
  
  console.log("AdminLogin - Estado atual:", { user: user?.email, loading, isAdmin });
  
  // Aguardar o carregamento inicial antes de qualquer decisão
  if (loading) {
    console.log("AdminLogin - Mostrando loading...");
    return <LoadingSpinner message="Verificando autenticação..." />;
  }
  
  // Se o usuário estiver autenticado e for admin, e não estiver na página de login intencionalmente
  if (user && isAdmin && !location.state?.forceLogin) {
    console.log("AdminLogin - Redirecionando usuário admin para:", from);
    return <Navigate to={from} replace />;
  }
  
  // Mostrar tela com opções baseada no estado do usuário
  console.log("AdminLogin - Renderizando tela de login/opções");
  return (
    <AdminLoginCard 
      onSignIn={signIn} 
      onSignUp={signUp} 
      onSignOut={signOut}
      user={user}
      isAdmin={isAdmin}
    />
  );
};

export default AdminLogin;
