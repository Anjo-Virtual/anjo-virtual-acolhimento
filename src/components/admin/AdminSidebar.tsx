
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MessageSquare,
  Mail,
  FileText,
  Share2,
  Settings,
  PenTool,
  MessageCircle,
  Users,
} from "lucide-react";

export const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      exact: true
    },
    {
      title: "Chat Dashboard",
      path: "/admin/chat-dashboard",
      icon: MessageCircle
    },
    {
      title: "Contatos",
      path: "/admin/contacts",
      icon: MessageSquare
    },
    {
      title: "Newsletter",
      path: "/admin/newsletter",
      icon: Mail
    },
    {
      title: "Blog",
      path: "/admin/blog",
      icon: FileText
    },
    {
      title: "Novo Post",
      path: "/admin/blog/create",
      icon: PenTool
    },
    {
      title: "Integrações",
      path: "/admin/integrations",
      icon: Share2
    },
    {
      title: "Usuários",
      path: "/admin/users",
      icon: Users
    },
    {
      title: "Configurações",
      path: "/admin/settings",
      icon: Settings
    }
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão do Site</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path, item.exact)}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
