
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new admin dashboard
    navigate("/admin");
    
    // Show a toast notification
    toast({
      title: "Redirecionando...",
      description: "Você está sendo redirecionado para o novo painel administrativo.",
      duration: 3000,
    });
  }, [navigate]);

  // Simple loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default Admin;
