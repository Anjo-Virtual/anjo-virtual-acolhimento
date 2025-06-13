import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CommunityAuthProvider } from "@/contexts/CommunityAuthContext";
import TrackingScripts from "@/components/TrackingScripts";
import AdminLayout from "@/layouts/AdminLayout";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminBlog from "@/pages/admin/Blog";
import AdminBlogCreate from "@/pages/admin/BlogCreate";
import AdminBlogEdit from "@/pages/admin/BlogEdit";
import AdminSettings from "@/pages/admin/Settings";
import CommunityLogin from "@/pages/community/Login";
import CommunityRegister from "@/pages/community/Register";
import CommunityDashboard from "@/pages/community/Dashboard";
import CommunityLayout from "@/layouts/CommunityLayout";
import CommunityProfile from "@/pages/community/Profile";
import CommunityBlog from "@/pages/community/Blog";
import CommunityBlogPost from "@/pages/community/BlogPost";
import Index from "./pages/Index";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import PoliticaDeCookies from "./pages/PoliticaDeCookies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <CommunityAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TrackingScripts />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/termos-de-uso" element={<TermosDeUso />} />
              <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
              <Route path="/politica-de-cookies" element={<PoliticaDeCookies />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="blog/create" element={<AdminBlogCreate />} />
                <Route path="blog/edit/:id" element={<AdminBlogEdit />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Community Routes */}
              <Route path="/comunidade/login" element={<CommunityLogin />} />
              <Route path="/comunidade/register" element={<CommunityRegister />} />
              <Route path="/comunidade" element={<CommunityLayout />}>
                <Route index element={<CommunityDashboard />} />
                <Route path="dashboard" element={<CommunityDashboard />} />
                <Route path="profile" element={<CommunityProfile />} />
                <Route path="blog" element={<CommunityBlog />} />
                <Route path="blog/:id" element={<CommunityBlogPost />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CommunityAuthProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
