
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LoadingSpinner } from "@/components/admin/auth/LoadingSpinner";
import { AccessDenied } from "@/components/admin/auth/AccessDenied";
import { AdminLoginCard } from "@/components/admin/auth/AdminLoginCard";

const AdminLogin = () => {
  const { signIn, signUp, user, loading, isAdmin } = useAdminAuth();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/admin";
  
  console.log("AdminLogin - Estado atual:", { user: user?.email, loading, isAdmin });
  
  // Aguardar o carregamento inicial antes de qualquer redirecionamento
  if (loading) {
    console.log("AdminLogin - Mostrando loading...");
    return <LoadingSpinner message="Verificando autenticação..." />;
  }
  
  // Se o usuário estiver autenticado e for admin, redirecionar para o painel
  if (user && isAdmin) {
    console.log("AdminLogin - Redirecionando usuário admin para:", from);
    return <Navigate to={from} replace />;
  }

  // Se o usuário estiver autenticado mas não for admin, mostrar tela de acesso negado
  if (user && !loading && !isAdmin) {
    console.log("AdminLogin - Usuário sem permissões de admin");
    return <AccessDenied userEmail={user.email} />;
  }
  
  // Se não estiver autenticado, mostrar tela de login
  console.log("AdminLogin - Renderizando tela de login");
  return <AdminLoginCard onSignIn={signIn} onSignUp={signUp} />;
};

export default AdminLogin;
