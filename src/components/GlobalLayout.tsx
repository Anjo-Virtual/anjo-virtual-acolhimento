
import { useCommunityAuth } from "@/contexts/CommunityAuthContext";
import GlobalPersistentChat from "./chat/GlobalPersistentChat";
import FloatingButtons from "./FloatingButtons";

const GlobalLayout = () => {
  const { user } = useCommunityAuth();

  return (
    <>
      {/* Mostrar FloatingButtons apenas para usuários não logados */}
      {!user && <FloatingButtons />}
      
      {/* Chat global persistente - disponível em todas as páginas (exceto admin) */}
      <GlobalPersistentChat />
    </>
  );
};

export default GlobalLayout;
