
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
import { useCommunityCategories } from "@/hooks/useCommunityCategories";
import { useEffect } from "react";

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
  const { categories, loading, error, refetch } = useCommunityCategories();

  // Log para debug das categorias carregadas
  useEffect(() => {
    console.log('🎯 Sidebar categories state:', { 
      loading, 
      error,
      categoriesCount: categories.length, 
      categories: categories.map(cat => ({ 
        name: cat.name, 
        slug: cat.slug, 
        active: cat.is_active,
        description: cat.description,
        sort_order: cat.sort_order 
      }))
    });
  }, [categories, loading, error]);

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

        {/* Seção de categorias dinâmica */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Categorias
            </h3>
            <button 
              onClick={() => {
                console.log('🔄 Manual category refresh triggered');
                refetch();
              }}
              className="text-xs text-gray-400 hover:text-gray-600 px-1"
              title="Atualizar categorias"
            >
              ↻
            </button>
          </div>
          
          {loading ? (
            <div className="space-y-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-3 py-2 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="px-3 py-2 text-xs text-red-500">
              Erro ao carregar categorias
              <button 
                onClick={refetch}
                className="block text-blue-500 hover:text-blue-700 mt-1"
              >
                Tentar novamente
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-500">
              Nenhuma categoria encontrada
            </div>
          ) : (
            <div className="space-y-1">
              {categories.map((category) => {
                console.log('🔗 Rendering category link:', category.name, 'to:', `/comunidade/${category.slug}`);
                return (
                  <NavLink
                    key={category.id}
                    to={`/comunidade/${category.slug}`}
                    className={({ isActive }) => {
                      console.log('🎯 Category link active state:', category.name, isActive);
                      return cn(
                        "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      );
                    }}
                    title={category.description || category.name}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3 flex-shrink-0" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="truncate">{category.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CommunitySidebar;
