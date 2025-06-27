
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Carregando..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-sm text-gray-600">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
