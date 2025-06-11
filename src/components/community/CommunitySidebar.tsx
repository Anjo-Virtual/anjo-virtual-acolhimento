
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar,
  Bookmark,
  Bell,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Feed",
    href: "/comunidade",
    icon: Home,
    exact: true
  },
  {
    title: "Discussões Ativas",
    href: "/comunidade/ativos",
    icon: TrendingUp
  },
  {
    title: "Grupos",
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
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        {/* Botão de criar post */}
        <NavLink to="/comunidade/criar-post">
          <Button className="w-full mb-6 justify-start" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Discussão
          </Button>
        </NavLink>

        {/* Menu de navegação */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* Seção de categorias */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Categorias
          </h3>
          <div className="space-y-1">
            <NavLink
              to="/comunidade/apoio-emocional"
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )
              }
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              Apoio Emocional
            </NavLink>
            <NavLink
              to="/comunidade/historias-superacao"
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )
              }
            >
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              Histórias de Superação
            </NavLink>
            <NavLink
              to="/comunidade/duvidas-orientacoes"
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive
                    ? "bg-yellow-50 text-yellow-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )
              }
            >
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              Dúvidas e Orientações
            </NavLink>
            <NavLink
              to="/comunidade/grupos-apoio"
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )
              }
            >
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              Grupos de Apoio
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CommunitySidebar;
