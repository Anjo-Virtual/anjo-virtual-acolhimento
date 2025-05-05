import { useState } from 'react';
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-2xl font-pacifico text-primary">Anjo Virtual</a>
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#sobre" className="text-gray-700 hover:text-primary transition-colors">Sobre</a>
          <a href="#como-funciona" className="text-gray-700 hover:text-primary transition-colors">Como Funciona</a>
          <a href="#planos" className="text-gray-700 hover:text-primary transition-colors">Planos</a>
          <a href="#comunidade" className="text-gray-700 hover:text-primary transition-colors">Comunidade do Luto</a>
          <a href="#empresas" className="text-gray-700 hover:text-primary transition-colors">Para Empresas</a>
          
        </nav>
        <div className="flex items-center">
          <a href="#" className="hidden lg:block bg-primary text-white px-6 py-2 rounded-button hover:bg-opacity-90 transition-colors whitespace-nowrap">Começar Gratuitamente</a>
          <button onClick={toggleMobileMenu} className="lg:hidden w-10 h-10 flex items-center justify-center">
            <i className="ri-menu-line ri-lg"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b">
          <a href="#" className="text-2xl font-pacifico text-primary">Anjo Virtual</a>
          <button onClick={toggleMobileMenu} className="w-10 h-10 flex items-center justify-center">
            <i className="ri-close-line ri-lg"></i>
          </button>
        </div>
        <div className="p-6 flex flex-col space-y-6">
          <a href="#sobre" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary transition-colors text-lg">Sobre</a>
          <a href="#como-funciona" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary transition-colors text-lg">Como Funciona</a>
          <a href="#planos" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary transition-colors text-lg">Planos</a>
          <a href="#comunidade" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary transition-colors text-lg">Comunidade do Luto</a>
          <a href="#empresas" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary transition-colors text-lg">Para Empresas</a>
          <a href="#" onClick={toggleMobileMenu} className="text-gray-700 hover:text-primary transition-colors text-lg">Entrar</a>
          <a href="#" onClick={toggleMobileMenu} className="bg-primary text-white px-6 py-3 rounded-button hover:bg-opacity-90 transition-colors text-center whitespace-nowrap">Começar Gratuitamente</a>
        </div>
      </div>
    </header>;
};
export default Header;