
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin"; // This will now be our redirect page
import { AdminLayout } from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Contacts from "./pages/admin/Contacts";
import Newsletter from "./pages/admin/Newsletter";
import BlogAdmin from "./pages/admin/Blog";
import BlogEdit from "./pages/admin/BlogEdit";
import Integrations from "./pages/admin/Integrations";
import Settings from "./pages/admin/Settings";
import Login from "./pages/admin/Login";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";
import ForumCategory from "./pages/ForumCategory";
import CreatePost from "./pages/CreatePost";
import ForumPost from "./pages/ForumPost";
import Groups from "./pages/Groups";
import ActiveForums from "./pages/ActiveForums";
import Messages from "./pages/Messages";
import Events from "./pages/Events";
import SavedPosts from "./pages/SavedPosts";
import Notifications from "./pages/Notifications";
import { TrackingScripts } from "./components/TrackingScripts";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import ClientArea from "./pages/ClientArea";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <TrackingScripts />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/comunidade" element={<Community />} />
            <Route path="/comunidade/ativos" element={<ActiveForums />} />
            <Route path="/comunidade/grupos" element={<Groups />} />
            <Route path="/comunidade/mensagens" element={<Messages />} />
            <Route path="/comunidade/eventos" element={<Events />} />
            <Route path="/comunidade/salvos" element={<SavedPosts />} />
            <Route path="/comunidade/notificacoes" element={<Notifications />} />
            <Route path="/pagamento-sucesso" element={<PaymentSuccess />} />
            <Route path="/pagamento-cancelado" element={<PaymentCanceled />} />
            <Route path="/minha-conta" element={<ClientArea />} />
            
            {/* Legacy Admin Route - Now redirects to new admin dashboard */}
            <Route path="/admin-old" element={<Admin />} />
            
            {/* Admin Login Route */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="newsletter" element={<Newsletter />} />
              <Route path="blog" element={<BlogAdmin />} />
              <Route path="blog/edit" element={<BlogEdit />} />
              <Route path="blog/edit/:id" element={<BlogEdit />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
