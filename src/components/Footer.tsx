
import Newsletter from "./Newsletter";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <img src="/lovable-uploads/9c10832e-edfc-4236-974a-8bf7c44d3f78.png" alt="Anjo Virtual" className="h-8" />
            </div>
            <p className="text-gray-300 mb-4">O primeiro assistente digital de acolhimento no luto. Um espaço seguro para encontrar conforto e esperança.</p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/anjovirtual.br/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors">
                <i className="ri-instagram-line"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors">
                <i className="ri-linkedin-line"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors">
                <i className="ri-whatsapp-line"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#sobre" className="text-gray-300 hover:text-white transition-colors">Sobre</a></li>
              <li><a href="#como-funciona" className="text-gray-300 hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#planos" className="text-gray-300 hover:text-white transition-colors">Planos</a></li>
              <li><a href="#comunidade" className="text-gray-300 hover:text-white transition-colors">Comunidade do Luto</a></li>
              <li><a href="#empresas" className="text-gray-300 hover:text-white transition-colors">Para Empresas</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                  <i className="ri-mail-line"></i>
                </div>
                <span className="text-gray-300">contato@anjovirtual.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 flex items-center justify-center text-primary mt-0.5">
                  <i className="ri-whatsapp-line"></i>
                </div>
                <span className="text-gray-300">(11) 99999-9999</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-4">Newsletter</h4>
              <Newsletter />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 Anjo Virtual. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Formas de pagamento:</span>
              <i className="ri-visa-fill ri-lg"></i>
              <i className="ri-mastercard-fill ri-lg"></i>
              <i className="ri-paypal-fill ri-lg"></i>
              <i className="ri-bank-card-fill ri-lg"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
