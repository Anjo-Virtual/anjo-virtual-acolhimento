
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-3 rounded-full">
            <XCircle className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Pagamento cancelado
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          O processo de pagamento foi interrompido ou cancelado. Nenhum valor foi cobrado.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={() => navigate("/planos")}
            className="w-full flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para os planos
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Ir para a página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCanceled;
