
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AdminLayout;
