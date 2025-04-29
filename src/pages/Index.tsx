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
import { useEffect } from "react";

const Index = () => {
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
    </div>
  );
};

export default Index;
