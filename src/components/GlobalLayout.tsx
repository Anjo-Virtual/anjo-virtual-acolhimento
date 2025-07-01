
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import CommunityChat from "./community/CommunityChat";
import FloatingButtons from "./FloatingButtons";

const GlobalLayout = () => {
  const { user } = useCommunityAuth();

  return (
    <>
      {/* Mostrar FloatingButtons apenas para usuários não logados */}
      {!user && <FloatingButtons />}
      
      {/* CommunityChat será renderizado condicionalmente dentro do próprio componente */}
      <CommunityChat />
    </>
  );
};

export default GlobalLayout;
