import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UsersIcon, Shield, Crown } from "lucide-react";
import { UsersList } from "@/components/admin/users/UsersList";
import { UserStatsCards } from "@/components/admin/users/UserStatsCards";
import { UserFilters } from "@/components/admin/users/UserFilters";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { isAdmin, loading: authLoading } = useAdminAuth();

  // Don't render if not authenticated as admin
  useEffect(() => {
    console.log("🔐 Admin auth status:", { isAdmin, authLoading });
  }, [isAdmin, authLoading]);

  // Fetch users with their roles from both systems
  const { data: users, isLoading, refetch, error } = useQuery({
    queryKey: ["admin-users", searchTerm, roleFilter, statusFilter],
    enabled: !authLoading && isAdmin, // Only run query if user is admin
    queryFn: async () => {
      console.log("🔍 Iniciando busca de usuários...");
      
      // Get users from auth system with their site roles
      const { data: authUsers, error: authError } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role,
          assigned_at,
          created_at
        `);

      console.log("🔐 Dados de user_roles:", { authUsers, authError });

      if (authError) {
        console.error("❌ Erro ao buscar user_roles:", authError);
        throw authError;
      }

      // Get community profiles with their roles and status
      const { data: communityData, error: communityError } = await supabase
        .from("community_profiles")
        .select(`
          id,
          user_id,
          display_name,
          bio,
          is_anonymous,
          status,
          joined_at,
          last_active
        `);

      console.log("👥 Dados de community_profiles:", { communityData, communityError });

      if (communityError) {
        console.error("❌ Erro ao buscar community_profiles:", communityError);
        throw communityError;
      }

      // Get community user roles separately to avoid relationship conflicts
      const { data: communityRoles, error: rolesError } = await supabase
        .from("community_user_roles")
        .select(`
          profile_id,
          role,
          assigned_at
        `);

      console.log("🔑 Dados de community_user_roles:", { communityRoles, rolesError });

      if (rolesError) {
        console.error("❌ Erro ao buscar community_user_roles:", rolesError);
        throw rolesError;
      }

      console.log("📊 Processando dados de usuários...");
      
      // Combine data to create unified user list
      const userMap = new Map();

      // Add auth users with site roles
      authUsers?.forEach(authUser => {
        if (!userMap.has(authUser.user_id)) {
          userMap.set(authUser.user_id, {
            user_id: authUser.user_id,
            site_role: authUser.role,
            site_role_assigned_at: authUser.assigned_at,
            community_profile: null,
            community_role: null,
            display_name: null,
            last_active: null,
            joined_at: authUser.created_at,
            status: 'active'
          });
        } else {
          const user = userMap.get(authUser.user_id);
          user.site_role = authUser.role;
          user.site_role_assigned_at = authUser.assigned_at;
        }
      });

      // Add community users
      communityData?.forEach(profile => {
        if (profile.user_id) {
          // Find the role for this profile
          const userRole = communityRoles?.find(role => role.profile_id === profile.id);
          
          if (!userMap.has(profile.user_id)) {
            userMap.set(profile.user_id, {
              user_id: profile.user_id,
              site_role: null,
              site_role_assigned_at: null,
              community_profile: profile,
              community_role: userRole?.role || null,
              community_role_assigned_at: userRole?.assigned_at || null,
              display_name: profile.display_name,
              last_active: profile.last_active,
              joined_at: profile.joined_at,
              status: profile.status || 'active'
            });
          } else {
            const user = userMap.get(profile.user_id);
            user.community_profile = profile;
            user.community_role = userRole?.role || null;
            user.community_role_assigned_at = userRole?.assigned_at || null;
            user.display_name = profile.display_name;
            user.last_active = profile.last_active;
            user.status = profile.status || 'active';
          }
        }
      });

      let filteredUsers = Array.from(userMap.values());

      // Apply filters
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
          user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (roleFilter !== "all") {
        filteredUsers = filteredUsers.filter(user => 
          user.site_role === roleFilter || user.community_role === roleFilter
        );
      }

      if (statusFilter !== "all") {
        if (statusFilter === "suspended" || statusFilter === "banned") {
          filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
        } else if (statusFilter === "active") {
          filteredUsers = filteredUsers.filter(user => user.status === "active");
        } else if (statusFilter === "recently_active") {
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredUsers = filteredUsers.filter(user => 
            user.status === "active" && user.last_active && new Date(user.last_active) > weekAgo
          );
        }
      }

      console.log("✅ Usuários processados:", filteredUsers.length);
      return filteredUsers;
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
  });

  // Calculate stats
  const stats = users ? {
    total: users.length,
    admins: users.filter(u => u.site_role === 'admin' || u.site_role === 'super_admin').length,
    communityMods: users.filter(u => u.community_role === 'moderator').length,
    activeLastWeek: users.filter(u => {
      if (!u.last_active) return false;
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(u.last_active) > weekAgo;
    }).length
  } : null;

  // Debug error if it exists
  if (error) {
    console.error("🚨 Erro na query de usuários:", error);
  }

  // Show loading if auth is loading
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Verificando permissões...</span>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md">
          <strong>Acesso negado:</strong> Você precisa ser administrador para acessar esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md">
          <strong>Erro ao carregar usuários:</strong> {error.message}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie usuários do site e da comunidade em um só lugar
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && <UserStatsCards stats={stats} />}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </CardContent>
        </Card>

        {/* Users List */}
        <UsersList 
          users={users || []} 
          isLoading={isLoading} 
          onRefetch={refetch}
        />
      </div>
    </div>
  );
}