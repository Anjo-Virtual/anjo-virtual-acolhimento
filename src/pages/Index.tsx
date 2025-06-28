import About from "@/components/About";
import Business from "@/components/Business";
import Community from "@/components/Community";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Plans from "@/components/Plans";
import Testimonials from "@/components/Testimonials";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ContactModal from "@/components/modals/ContactModal";
import ChatModal from "@/components/modals/ChatModal";

const Index = () => {
  const location = useLocation();
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    // Verificar se deve abrir o chat após redirecionamento
    if (location.state?.openChat) {
      setShowChatModal(true);
      // Limpar o state para evitar reabrir em navegações futuras
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    // Implementando efeito de rolagem suave para links de ancoragem
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  return (
    <div className="bg-white">
      <Header />
      <Hero />
      <About />
      <HowItWorks />
      <Plans />
      <Testimonials />
      <Community />
      <Business />
      <Footer />
      <FloatingButtons />
      
      <ContactModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
      
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
    </div>
  );
};

export default Index;
