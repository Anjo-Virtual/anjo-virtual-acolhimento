
export const useHeaderNavigation = () => {
  const handleCommunityScroll = () => {
    // Scroll to the community section on home page
    const communitySection = document.getElementById('comunidade');
    if (communitySection) {
      const headerOffset = 80;
      const elementPosition = communitySection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // If not on home page, navigate to home and then scroll
      window.location.href = '/#comunidade';
    }
  };

  const handleEmpresasClick = () => {
    // Scroll to the business section
    const businessSection = document.getElementById('empresas');
    if (businessSection) {
      const headerOffset = 80;
      const elementPosition = businessSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // If not on home page, navigate to home and then scroll
      window.location.href = '/#empresas';
    }
  };

  return { handleCommunityScroll, handleEmpresasClick };
};
