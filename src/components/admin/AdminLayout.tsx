
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { AdminSidebar } from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { LoadingSpinner } from "./auth/LoadingSpinner";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  title?: string;
}

const AdminLayout = ({ title = "Painel Administrativo" }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user: adminUser, loading: adminLoading } = useAdminAuth();
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
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader title={title} userEmail={userEmail} />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
