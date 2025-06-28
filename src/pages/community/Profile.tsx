
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ProfileForm from "@/components/community/profile/ProfileForm";
import PreferencesTab from "@/components/community/profile/PreferencesTab";
import NotificationsTab from "@/components/community/profile/NotificationsTab";
import AdminTab from "@/components/community/profile/AdminTab";
import DangerZone from "@/components/community/profile/DangerZone";
import CommunityPageLayout from "@/components/community/CommunityPageLayout";
import ProfileHeader from "@/components/community/profile/ProfileHeader";
import { Shield } from "lucide-react";

const CommunityProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Check if user is admin using the new RPC function
  const { data: isAdmin, isLoading: adminLoading } = useQuery({
    queryKey: ['current-user-admin-status'],
    queryFn: async () => {
      console.log('🔐 Checking admin status...');
      const { data, error } = await supabase.rpc('current_user_is_admin');
      
      if (error) {
        console.error('❌ Error checking admin status:', error);
        return false;
      }
      
      console.log('✅ Admin status result:', data);
      return data || false;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  console.log('🎯 Profile render - isAdmin:', isAdmin, 'adminLoading:', adminLoading);

  return (
    <CommunityPageLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <ProfileHeader />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Configurações da Conta
              {!adminLoading && isAdmin && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="preferences">Preferências</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                {!adminLoading && isAdmin && (
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </TabsTrigger>
                )}
                <TabsTrigger value="danger">Zona de Perigo</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <ProfileForm />
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <PreferencesTab />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <NotificationsTab />
              </TabsContent>

              {!adminLoading && isAdmin && (
                <TabsContent value="admin" className="space-y-6">
                  <AdminTab />
                </TabsContent>
              )}

              <TabsContent value="danger" className="space-y-6">
                <DangerZone />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </CommunityPageLayout>
  );
};

export default CommunityProfile;
