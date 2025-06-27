
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import LoadingSpinner from "./auth/LoadingSpinner";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title = "Painel Administrativo" }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user: adminUser, isLoading: adminLoading } = useAdminAuth();
  const { user: communityUser } = useCommunityAuth();

  useEffect(() => {
    if (!adminLoading && !adminUser && !communityUser) {
      navigate("/admin/login");
    }
  }, [adminUser, communityUser, adminLoading, navigate]);

  if (adminLoading) {
    return <LoadingSpinner />;
  }

  if (!adminUser && !communityUser) {
    return null;
  }

  const userEmail = adminUser?.email || communityUser?.email;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title={title} userEmail={userEmail} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
