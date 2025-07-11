
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CommunityAuthProvider } from "@/contexts/CommunityAuthContext";
import { TrackingScripts } from "@/components/TrackingScripts";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import GlobalLayout from "@/components/GlobalLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import PoliticaDeCookies from "./pages/PoliticaDeCookies";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Community from "./pages/Community";
import CommunityLogin from "./pages/community/Login";
import CommunityProfile from "./pages/community/Profile";
import AdminLogin from "./pages/admin/Login";
import Groups from "./pages/Groups";
import ActiveForums from "./pages/ActiveForums";
import ForumCategory from "./pages/ForumCategory";
import ForumPost from "./pages/ForumPost";
import CreatePost from "./pages/CreatePost";
import Messages from "./pages/Messages";
import Events from "./pages/Events";
import SavedPosts from "./pages/SavedPosts";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/admin/Dashboard";
import Contacts from "./pages/admin/Contacts";
import Newsletter from "./pages/admin/Newsletter";
import AdminBlog from "./pages/admin/Blog";
import BlogEdit from "./pages/admin/BlogEdit";
import Categories from "./pages/admin/Categories";
import Integrations from "./pages/admin/Integrations";
import Settings from "./pages/admin/Settings";
import ChatDashboard from "./pages/admin/ChatDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Não tentar novamente em erros de permissão ou tabela não encontrada
        if (error?.code === 'PGRST301' || error?.code === 'PGRST116' || 
            error?.message?.includes('permission') || error?.message?.includes('relation')) {
          return false;
        }
        return failureCount < 2; // Reduzir tentativas
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false, // Evitar refetch desnecessário
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <CommunityAuthProvider>
            <ErrorBoundary>
              <TrackingScripts />
            </ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/comunidade" element={<Community />} />
              <Route path="/comunidade/login" element={<CommunityLogin />} />
              <Route path="/comunidade/perfil" element={<CommunityProfile />} />
              <Route path="/comunidade/grupos" element={<Groups />} />
              <Route path="/comunidade/ativos" element={<ActiveForums />} />
              <Route path="/comunidade/mensagens" element={<Messages />} />
              <Route path="/comunidade/eventos" element={<Events />} />
              <Route path="/comunidade/salvos" element={<SavedPosts />} />
              <Route path="/comunidade/notificacoes" element={<Notifications />} />
              <Route path="/comunidade/criar-post" element={<CreatePost />} />
              <Route path="/comunidade/post/:postId" element={<ForumPost />} />
              {/* Generic category route - handles all category slugs */}
              <Route path="/comunidade/:slug" element={<ForumCategory />} />
              <Route path="/termos-de-uso" element={<TermosDeUso />} />
              <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
              <Route path="/politica-de-cookies" element={<PoliticaDeCookies />} />
              
              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ErrorBoundary>
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                </ErrorBoundary>
              }>
                <Route index element={<Dashboard />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="newsletter" element={<Newsletter />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="blog/create" element={<BlogEdit />} />
                <Route path="blog/edit/:id" element={<BlogEdit />} />
                <Route path="categories" element={<Categories />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="settings" element={<Settings />} />
                <Route path="chat-dashboard" element={<ChatDashboard />} />
              </Route>
            </Routes>
            
            {/* Layout Global - Chat e FloatingButtons */}
            <ErrorBoundary>
              <GlobalLayout />
            </ErrorBoundary>
          </CommunityAuthProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
