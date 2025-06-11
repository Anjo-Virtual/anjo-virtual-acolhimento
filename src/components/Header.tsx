
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMobile } from "@/hooks/useMobile";
import { Menu, X } from "lucide-react";
import { useModalControls } from "./FloatingButtons";
import { useSafeAdminAuth } from "@/hooks/useSafeAdminAuth";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import { useHeaderNavigation } from "@/hooks/useHeaderNavigation";
import { NavigationLinks } from "./header/NavigationLinks";
import { HeaderActions } from "./header/HeaderActions";
import { MobileMenu } from "./header/MobileMenu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMobile();
  const { user } = useSafeAdminAuth();
  const isScrolled = useHeaderScroll();
  const { handleCommunityScroll, handleEmpresasClick } = useHeaderNavigation();
  const { openChatModal } = useModalControls();

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
              <NavigationLinks 
                onCommunityScroll={handleCommunityScroll}
                onEmpresasClick={handleEmpresasClick}
              />
              <HeaderActions 
                user={user}
                openChatModal={openChatModal}
              />
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
        {isMobile && (
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            user={user}
            onCommunityScroll={handleCommunityScroll}
            onEmpresasClick={handleEmpresasClick}
            openChatModal={openChatModal}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
