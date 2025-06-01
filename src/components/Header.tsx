
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/useMobile";
import { Menu, X, MessageCircle, UserCircle, Users } from "lucide-react";
import { useModalControls } from "./FloatingButtons";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMobile();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { openChatModal } = useModalControls();

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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold text-gray-800">Anjo Virtual</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-6">
                <a href="#como-funciona" className="text-gray-700 hover:text-primary transition-colors">
                  Como Funciona
                </a>
                <a href="#planos" className="text-gray-700 hover:text-primary transition-colors">
                  Planos
                </a>
                <button 
                  onClick={handleCommunityScroll}
                  className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Users size={18} />
                  Comunidade
                </button>
                <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors">
                  Blog
                </Link>
                <button 
                  onClick={handleEmpresasClick}
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Para Empresas
                </button>
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <Link 
                    to="/minha-conta" 
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-button hover:bg-opacity-90 transition-colors"
                  >
                    <UserCircle size={18} />
                    Minha Conta
                  </Link>
                ) : (
                  <Link 
                    to="/admin/login" 
                    className="text-gray-700 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                )}
                <Button
                  onClick={openChatModal}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  Fale Conosco
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </nav>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 pb-4 space-y-3">
            <a
              href="#como-funciona"
              className="block text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Como Funciona
            </a>
            <a
              href="#planos"
              className="block text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planos
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleCommunityScroll();
              }}
              className="block text-gray-700 hover:text-primary transition-colors py-2 text-left flex items-center gap-2"
            >
              <Users size={18} />
              Comunidade
            </button>
            <Link
              to="/blog"
              className="block text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleEmpresasClick();
              }}
              className="block text-gray-700 hover:text-primary transition-colors py-2 text-left"
            >
              Para Empresas
            </button>
            
            {user ? (
              <Link
                to="/minha-conta"
                className="block text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Minha Conta
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="block text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
            
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                openChatModal();
              }}
              variant="outline"
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Fale Conosco
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
