
import { useNavigate, useLocation } from "react-router-dom";

export const useHeaderNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Se estiver na home, fazer scroll direto
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Se não estiver na home, navegar para home e depois fazer scroll
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const handleComoFuncionaClick = () => {
    scrollToSection('como-funciona');
  };

  const handlePlanosClick = () => {
    scrollToSection('planos');
  };

  const handleCommunityScroll = () => {
    scrollToSection('comunidade');
  };

  const handleEmpresasClick = () => {
    scrollToSection('empresas');
  };

  const handleBlogClick = () => {
    scrollToSection('blog');
  };

  return { 
    handleComoFuncionaClick,
    handlePlanosClick,
    handleCommunityScroll, 
    handleEmpresasClick,
    handleBlogClick
  };
};
