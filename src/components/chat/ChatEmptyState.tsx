
import { Bot } from "lucide-react";

export const ChatEmptyState = () => {
  return (
    <div className="text-center text-gray-500 py-8">
      <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p className="text-base sm:text-lg">Olá! Sou seu assistente de acolhimento.</p>
      <p className="text-sm text-gray-400 mt-1">Como posso ajudá-lo hoje?</p>
    </div>
  );
};
