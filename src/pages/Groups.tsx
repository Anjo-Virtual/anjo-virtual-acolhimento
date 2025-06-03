
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Lock, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useGroups } from "@/hooks/useGroups";
import CreateGroupForm from "@/components/community/CreateGroupForm";
import GroupCard from "@/components/community/GroupCard";

const Groups = () => {
  const { user } = useAuth();
  const { groups, myGroups, loading, createGroup, joinGroup, leaveGroup } = useGroups();
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Você precisa estar logado para acessar os grupos da comunidade.
            </p>
            <Link to="/admin/login">
              <Button size="lg">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateGroup = async (data: {
    name: string;
    description: string;
    is_private: boolean;
    max_members: number;
  }) => {
    const success = await createGroup(data);
    if (success) {
      setShowCreateForm(false);
    }
    return success;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando grupos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Grupos da Comunidade</h1>
                <p className="text-gray-600">
                  Participe de grupos de apoio focados em diferentes aspectos do luto e recuperação
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                {showCreateForm ? 'Cancelar' : 'Criar Grupo'}
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{groups.length}</div>
                  <div className="text-sm text-gray-600">Grupos Ativos</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Lock className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {groups.filter(g => g.is_private).length}
                  </div>
                  <div className="text-sm text-gray-600">Grupos Privados</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Globe className="h-8 w-8 text-tertiary mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {groups.filter(g => !g.is_private).length}
                  </div>
                  <div className="text-sm text-gray-600">Grupos Públicos</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Create Group Form */}
          {showCreateForm && (
            <div className="mb-8">
              <CreateGroupForm 
                onSuccess={() => setShowCreateForm(false)}
                onCancel={() => setShowCreateForm(false)}
                onSubmit={handleCreateGroup}
              />
            </div>
          )}

          {/* Groups Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todos os Grupos</TabsTrigger>
              <TabsTrigger value="my-groups">Meus Grupos ({myGroups.length})</TabsTrigger>
              <TabsTrigger value="public">Grupos Públicos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <GroupCard 
                    key={group.id} 
                    group={group}
                    onJoin={joinGroup}
                    onLeave={leaveGroup}
                  />
                ))}
              </div>
              {groups.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum grupo encontrado
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Seja o primeiro a criar um grupo de apoio para a comunidade.
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      Criar Primeiro Grupo
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="my-groups" className="mt-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGroups.map((group) => (
                  <GroupCard 
                    key={group.id} 
                    group={group}
                    onLeave={leaveGroup}
                    showActions={true}
                  />
                ))}
              </div>
              {myGroups.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Você ainda não participa de nenhum grupo
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Explore os grupos disponíveis ou crie um novo grupo de apoio.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="public" className="mt-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.filter(g => !g.is_private).map((group) => (
                  <GroupCard 
                    key={group.id} 
                    group={group}
                    onJoin={joinGroup}
                    onLeave={leaveGroup}
                  />
                ))}
              </div>
              {groups.filter(g => !g.is_private).length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum grupo público disponível
                    </h3>
                    <p className="text-gray-600">
                      Todos os grupos ativos são privados no momento.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Groups;
