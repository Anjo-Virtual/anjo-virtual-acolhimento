
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Calendar,
  Settings,
  Bell,
  Bookmark,
  TrendingUp,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Visão Geral",
    href: "/comunidade",
    icon: Home,
    exact: true
  },
  {
    title: "Fóruns Ativos",
    href: "/comunidade/ativos",
    icon: TrendingUp
  },
  {
    title: "Meus Grupos",
    href: "/comunidade/grupos",
    icon: Users
  },
  {
    title: "Mensagens",
    href: "/comunidade/mensagens",
    icon: MessageSquare
  },
  {
    title: "Eventos",
    href: "/comunidade/eventos",
    icon: Calendar
  },
  {
    title: "Salvos",
    href: "/comunidade/salvos",
    icon: Bookmark
  },
  {
    title: "Notificações",
    href: "/comunidade/notificacoes",
    icon: Bell
  }
];

const CommunitySidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon size={20} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats Widget */}
        <div className="mt-8 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-medium text-gray-900">Seu Progresso</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Posts criados</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Comentários</span>
              <span className="font-medium">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Curtidas recebidas</span>
              <span className="font-medium">89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;
