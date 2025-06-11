
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search } from "lucide-react";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import CommunityLayout from "@/components/community/CommunityLayout";

type Group = {
  id: string;
  name: string;
  description: string;
  member_count: number;
  is_private: boolean;
  created_at: string;
  image_url?: string;
};

const Groups = () => {
  const { user } = useCommunityAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      // Fetch user's groups through group_members table
      const { data: userGroups, error: userGroupsError } = await supabase
        .from('group_members')
        .select(`
          group:community_groups(
            id,
            name,
            description,
            is_private,
            created_at,
            current_members
          )
        `)
        .eq('profile_id', user?.id);
      
      if (userGroupsError) throw userGroupsError;
      
      // Fetch public groups
      const { data: allPublicGroups, error: publicGroupsError } = await supabase
        .from('community_groups')
        .select('*')
        .eq('is_private', false)
        .order('current_members', { ascending: false });
      
      if (publicGroupsError) throw publicGroupsError;
      
      // Format user groups
      const formattedUserGroups = userGroups
        .map(item => item.group)
        .filter(Boolean)
        .map(group => ({
          ...group,
          member_count: group.current_members
        })) as Group[];
      
      setMyGroups(formattedUserGroups);
      
      // Filter out groups the user is already a member of
      const userGroupIds = new Set(formattedUserGroups.map(g => g.id));
      const filteredPublicGroups = (allPublicGroups || [])
        .filter(g => !userGroupIds.has(g.id))
        .map(group => ({
          ...group,
          member_count: group.current_members
        })) as Group[];
      
      setPublicGroups(filteredPublicGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os grupos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          profile_id: user?.id,
          role: 'member'
        });
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Você entrou no grupo com sucesso!",
      });
      
      // Refresh groups
      fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível entrar no grupo.",
        variant: "destructive",
      });
    }
  };

  const filteredPublicGroups = publicGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMyGroups = myGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CommunityLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grupos</h1>
            <p className="text-gray-600">Encontre e participe de grupos de apoio</p>
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar grupos..."
                className="pl-10 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="my-groups">
          <TabsList className="mb-6">
            <TabsTrigger value="my-groups" className="flex items-center gap-2">
              <Users size={16} />
              Meus Grupos
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Plus size={16} />
              Descobrir Grupos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-groups">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando seus grupos...</p>
              </div>
            ) : filteredMyGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyGroups.map((group) => (
                  <Link to={`/comunidade/grupos/${group.id}`} key={group.id}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              {group.image_url ? (
                                <AvatarImage src={group.image_url} alt={group.name} />
                              ) : (
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {group.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{group.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {group.member_count} {group.member_count === 1 ? 'membro' : 'membros'}
                              </CardDescription>
                            </div>
                          </div>
                          {group.is_private && (
                            <Badge variant="outline" className="ml-2">Privado</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Você ainda não participa de nenhum grupo
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Encontre grupos de apoio na aba "Descobrir Grupos"
                  </p>
                  <Button onClick={() => {
                    const discoverTab = document.querySelector('[value="discover"]') as HTMLElement;
                    discoverTab?.click();
                  }}>
                    Descobrir Grupos
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="discover">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Descobrindo grupos...</p>
              </div>
            ) : filteredPublicGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPublicGroups.map((group) => (
                  <Card key={group.id} className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            {group.image_url ? (
                              <AvatarImage src={group.image_url} alt={group.name} />
                            ) : (
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {group.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {group.member_count} {group.member_count === 1 ? 'membro' : 'membros'}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{group.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => joinGroup(group.id)}
                      >
                        Participar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum grupo disponível
                  </h3>
                  <p className="text-gray-600">
                    Não encontramos grupos públicos disponíveis no momento.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </CommunityLayout>
  );
};

export default Groups;
