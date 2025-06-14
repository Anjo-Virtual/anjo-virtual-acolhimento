
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CommunityAuthProvider } from "@/contexts/CommunityAuthContext";
import { TrackingScripts } from "@/components/TrackingScripts";
import Index from "./pages/Index";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import PoliticaDeCookies from "./pages/PoliticaDeCookies";
import Blog from "./pages/Blog";
import Community from "./pages/Community";
import CommunityLogin from "./pages/community/Login";
import AdminLogin from "./pages/admin/Login";
import Groups from "./pages/Groups";
import ActiveForums from "./pages/ActiveForums";
import ForumCategory from "./pages/ForumCategory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <CommunityAuthProvider>
            <TrackingScripts />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/comunidade" element={<Community />} />
              <Route path="/comunidade/login" element={<CommunityLogin />} />
              <Route path="/comunidade/grupos" element={<Groups />} />
              <Route path="/comunidade/ativos" element={<ActiveForums />} />
              <Route path="/comunidade/:slug" element={<ForumCategory />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/termos-de-uso" element={<TermosDeUso />} />
              <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
              <Route path="/politica-de-cookies" element={<PoliticaDeCookies />} />
            </Routes>
          </CommunityAuthProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
