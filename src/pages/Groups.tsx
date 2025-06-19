
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityPageLayout from "@/components/community/CommunityPageLayout";
import GroupCard from "@/components/community/GroupCard";
import CreateGroupForm from "@/components/community/CreateGroupForm";
import { useGroupsData } from "@/hooks/useGroupsData";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";

const Groups = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useCommunityAuth();
  const { groups, myGroups, loading, createGroup, joinGroup, leaveGroup } = useGroupsData();

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
            <Link to="/comunidade/login">
              <Button size="lg">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CommunityPageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Grupos da Comunidade</h1>
                <p className="text-gray-600 mt-1">Encontre e participe de grupos de apoio</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              {showCreateForm ? 'Cancelar' : 'Criar Grupo'}
            </Button>
          </div>
        </div>

        {/* Create Group Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreateGroupForm 
              onSuccess={() => setShowCreateForm(false)}
              onSubmit={createGroup}
            />
          </div>
        )}

        {/* Meus Grupos */}
        {myGroups.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Meus Grupos</CardTitle>
              <CardDescription>
                Grupos dos quais você participa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <CardTitle>Todos os Grupos</CardTitle>
            <CardDescription>
              Descubra novos grupos para participar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Carregando grupos...</div>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum grupo encontrado
                </h3>
                <p className="text-gray-500">
                  Seja o primeiro a criar um grupo na comunidade.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
