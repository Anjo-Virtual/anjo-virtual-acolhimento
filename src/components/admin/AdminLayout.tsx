
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <div className="flex w-full flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">Painel Administrativo</h1>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/"}
              >
                Voltar ao site
              </Button>
            </header>
            <main className="flex-1 p-4 lg:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
