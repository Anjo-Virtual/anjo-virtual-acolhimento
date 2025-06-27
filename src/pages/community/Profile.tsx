
import { useState, useEffect } from "react";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { useCommunityProfile } from "@/hooks/useCommunityProfile";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Settings, Bell, Folder } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityHeader from "@/components/community/CommunityHeader";
import ProfileHeader from "@/components/community/profile/ProfileHeader";
import ProfileForm from "@/components/community/profile/ProfileForm";
import PreferencesTab from "@/components/community/profile/PreferencesTab";
import NotificationsTab from "@/components/community/profile/NotificationsTab";
import AdminTab from "@/components/community/profile/AdminTab";
import DangerZone from "@/components/community/profile/DangerZone";

const CommunityProfile = () => {
  const { user } = useCommunityAuth();
  const { loading } = useCommunityProfile();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'super_admin']);
        
        if (!error && data && data.length > 0) {
          setIsAdmin(true);
        }
      }
    };
    
    checkAdminStatus();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CommunityHeader />
        <div className="flex items-center justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProfileHeader />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferências
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Administração
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesTab />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <AdminTab />
            </TabsContent>
          )}
        </Tabs>

        <DangerZone />
      </div>
    </div>
  );
};

export default CommunityProfile;
