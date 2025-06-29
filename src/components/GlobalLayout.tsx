
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import CommunityChat from "./community/CommunityChat";
import FloatingButtons from "./FloatingButtons";

const GlobalLayout = () => {
  const { user } = useCommunityAuth();

  return (
    <>
      {/* Mostrar FloatingButtons apenas para usuários não logados */}
      {!user && <FloatingButtons />}
      
      {/* CommunityChat apenas para usuários logados */}
      {user && <CommunityChat />}
    </>
  );
};

export default GlobalLayout;
