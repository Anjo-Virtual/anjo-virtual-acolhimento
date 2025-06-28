
import { useNavigate } from "react-router-dom";

export const useBlogNavigation = () => {
  const navigate = useNavigate();

  const navigateToBlog = () => {
    navigate('/blog');
  };

  const navigateToBlogPost = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const scrollToBlogSection = () => {
    // Se estiver na home, fazer scroll para seção blog
    if (window.location.pathname === '/') {
      const blogSection = document.getElementById('blog');
      if (blogSection) {
        const headerOffset = 80;
        const elementPosition = blogSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Se não estiver na home, navegar para home e depois fazer scroll
      navigate('/#blog');
    }
  };

  return {
    navigateToBlog,
    navigateToBlogPost,
    navigateToHome,
    scrollToBlogSection
  };
};
