
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
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
import CommunityLogin from "./pages/community/Login";
import { TrackingScripts } from "./components/TrackingScripts";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { CommunityAuthProvider } from "./contexts/CommunityAuthContext";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import { ProtectedCommunityRoute } from "./components/community/ProtectedCommunityRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import ClientArea from "./pages/ClientArea";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <TrackingScripts />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/pagamento-sucesso" element={<PaymentSuccess />} />
            <Route path="/pagamento-cancelado" element={<PaymentCanceled />} />
            <Route path="/minha-conta" element={<ClientArea />} />
            
            {/* Legacy Admin Route - Now redirects to new admin dashboard */}
            <Route path="/admin-old" element={<Admin />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            
            <Route path="/admin/*" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
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
            
            {/* Community Routes with CommunityAuthProvider */}
            <Route path="/comunidade/login" element={
              <CommunityAuthProvider>
                <CommunityLogin />
              </CommunityAuthProvider>
            } />
            
            <Route path="/comunidade/*" element={
              <CommunityAuthProvider>
                <Routes>
                  <Route index element={<Community />} />
                  <Route path="ativos" element={
                    <ProtectedCommunityRoute>
                      <ActiveForums />
                    </ProtectedCommunityRoute>
                  } />
                  <Route path="grupos" element={
                    <ProtectedCommunityRoute>
                      <Groups />
                    </ProtectedCommunityRoute>
                  } />
                  <Route path="mensagens" element={
                    <ProtectedCommunityRoute>
                      <Messages />
                    </ProtectedCommunityRoute>
                  } />
                  <Route path="eventos" element={
                    <ProtectedCommunityRoute>
                      <Events />
                    </ProtectedCommunityRoute>
                  } />
                  <Route path="salvos" element={
                    <ProtectedCommunityRoute>
                      <SavedPosts />
                    </ProtectedCommunityRoute>
                  } />
                  <Route path="notificacoes" element={
                    <ProtectedCommunityRoute>
                      <Notifications />
                    </ProtectedCommunityRoute>
                  } />
                  <Route path="criar-post" element={
                    <ProtectedCommunityRoute>
                      <CreatePost />
                    </ProtectedCommunityRoute>
                  } />
                  <Route path=":categoria" element={
                    <ProtectedCommunityRoute>
                      <ForumCategory />
                    </ProtectedCommunityRoute>
                  } />
                  <Route path="post/:id" element={
                    <ProtectedCommunityRoute>
                      <ForumPost />
                    </ProtectedCommunityRoute>
                  } />
                </Routes>
              </CommunityAuthProvider>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
