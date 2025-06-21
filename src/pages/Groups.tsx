
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityPageLayout from "@/components/community/CommunityPageLayout";
import GroupCard from "@/components/community/GroupCard";
import CreateGroupForm from "@/components/community/CreateGroupForm";
import { useGroupsData } from "@/hooks/useGroupsData";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Groups = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useCommunityAuth();
  const { groups, myGroups, loading, createGroup, joinGroup, leaveGroup } = useGroupsData();

  console.log('[Groups] Estado atual:', { 
    user: !!user, 
    totalGroups: groups.length, 
    myGroupsCount: myGroups.length, 
    loading,
    showCreateForm 
  });

  if (!user) {
    return (
      <CommunityPageLayout>
        <div className="max-w-4xl mx-auto text-center py-12 lg:py-20">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Você precisa estar logado para acessar os grupos da comunidade.
            </p>
            <Link to="/comunidade/login">
              <Button size="lg">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </CommunityPageLayout>
    );
  }

  return (
    <CommunityPageLayout>
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex items-start lg:items-center gap-3 lg:gap-4">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Grupos da Comunidade
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Encontre e participe de grupos de apoio
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 w-full lg:w-auto"
              size="lg"
            >
              <Plus size={18} />
              {showCreateForm ? 'Cancelar' : 'Criar Grupo'}
            </Button>
          </div>
        </div>

        {/* Debug info durante desenvolvimento */}
        {process.env.NODE_ENV === 'development' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Debug: {groups.length} grupos encontrados, {myGroups.length} grupos do usuário
            </AlertDescription>
          </Alert>
        )}

        {/* Create Group Form */}
        {showCreateForm && (
          <CreateGroupForm 
            onSuccess={() => setShowCreateForm(false)}
            onSubmit={createGroup}
          />
        )}

        {/* Meus Grupos */}
        {myGroups.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Meus Grupos
              </CardTitle>
              <CardDescription>
                Grupos dos quais você participa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myGroups.map((group) => (
                  <GroupCard 
                    key={group.id} 
                    group={group}
                    onLeave={leaveGroup}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Todos os Grupos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Todos os Grupos
            </CardTitle>
            <CardDescription>
              Descubra novos grupos para participar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <div className="text-gray-500">Carregando grupos...</div>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-12 lg:py-16">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum grupo encontrado
                </h3>
                <p className="text-gray-500 mb-6">
                  Seja o primeiro a criar um grupo na comunidade.
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Criar Primeiro Grupo
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <GroupCard 
                    key={group.id} 
                    group={group}
                    onJoin={joinGroup}
                    onLeave={leaveGroup}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CommunityPageLayout>
  );
};

export default Groups;
