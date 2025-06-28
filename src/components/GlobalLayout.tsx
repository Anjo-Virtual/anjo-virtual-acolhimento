
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import CommunityChat from "./community/CommunityChat";
import FloatingButtons from "./FloatingButtons";

const GlobalLayout = () => {
  const { user } = useCommunityAuth();

  return (
    <>
      {/* FloatingButtons sempre visível para usuários não logados */}
      {!user && <FloatingButtons />}
      
      {/* CommunityChat sempre visível para usuários logados */}
      {user && <CommunityChat />}
    </>
  );
};

export default GlobalLayout;
