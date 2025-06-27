
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/community/profile/ProfileForm";
import { PreferencesTab } from "@/components/community/profile/PreferencesTab";
import { NotificationsTab } from "@/components/community/profile/NotificationsTab";
import { AdminTab } from "@/components/community/profile/AdminTab";
import { DangerZone } from "@/components/community/profile/DangerZone";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { ProfileHeader } from "@/components/community/profile/ProfileHeader";

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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1
  });

  console.log('🎯 Profile render - isAdmin:', isAdmin, 'adminLoading:', adminLoading);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CommunitySidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <ProfileHeader />
          
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                  <TabsTrigger value="preferences">Preferências</TabsTrigger>
                  <TabsTrigger value="notifications">Notificações</TabsTrigger>
                  {!adminLoading && isAdmin && (
                    <TabsTrigger value="admin">Admin</TabsTrigger>
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
      </div>
    </div>
  );
};

export default CommunityProfile;
