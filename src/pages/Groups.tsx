
import CommunityPageLayout from "@/components/community/CommunityPageLayout";
import GroupsTemporarilyDisabled from "@/components/community/GroupsTemporarilyDisabled";
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Groups = () => {
  const { user } = useCommunityAuth();

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
      <GroupsTemporarilyDisabled />
    </CommunityPageLayout>
  );
};

export default Groups;
