
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import CommunityChat from "./community/CommunityChat";
import FloatingButtons from "./FloatingButtons";

const GlobalLayout = () => {
  const { user } = useCommunityAuth();

  return (
    <>
      {/* FloatingButtons sempre visível para usuários não logados */}
      {!user && <FloatingButtons />}
      
      {/* CommunityChat sempre visível - funciona com ou sem login */}
      <CommunityChat />
    </>
  );
};

export default GlobalLayout;
