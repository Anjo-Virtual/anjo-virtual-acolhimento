
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X, Search } from "lucide-react";
import UserDropdownMenu from "./UserDropdownMenu";
import MobileNavigationMenu from "./MobileNavigationMenu";

const CommunityHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/comunidade" className="flex items-center space-x-2">
            <img src="/logo-anjo-roxa.png" alt="Anjo Virtual - Comunidade" className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/comunidade"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Feed
            </Link>
            <Link
              to="/comunidade/grupos"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Grupos
            </Link>
            <Link
              to="/comunidade/ativos"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Discussões Ativas
            </Link>
            <Link
              to="/comunidade/eventos"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Eventos
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/comunidade/criar-post">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link to="/comunidade/notificacoes">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>

            <UserDropdownMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <MobileNavigationMenu 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>
    </header>
  );
};

export default CommunityHeader;
