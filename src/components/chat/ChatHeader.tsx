
import { Bot } from "lucide-react";

export const ChatHeader = () => {
  return (
    <div className="flex-shrink-0 p-4 border-b bg-gray-50 rounded-t-lg">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Assistente de Acolhimento</h3>
      </div>
    </div>
  );
};
