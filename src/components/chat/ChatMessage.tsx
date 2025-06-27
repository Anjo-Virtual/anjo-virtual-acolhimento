
import { Bot, User, ExternalLink } from "lucide-react";

interface MessageSource {
  documentName: string;
  documentId: string;
  chunkText: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: MessageSource[];
  created_at: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex gap-3 ${
        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        message.role === 'user' 
          ? 'bg-primary text-white' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {message.role === 'user' ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      
      <div className={`max-w-[80%] sm:max-w-[85%] ${
        message.role === 'user' ? 'text-right' : 'text-left'
      }`}>
        <div className={`px-4 py-3 rounded-lg break-words ${
          message.role === 'user'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-800'
        }`}>
          <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
        </div>
        
        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Fontes consultadas:</p>
            <div className="space-y-1">
              {message.sources.map((source, index) => (
                <div
                  key={index}
                  className="text-xs bg-blue-50 border border-blue-200 rounded p-2"
                >
                  <div className="flex items-center gap-1 font-medium text-blue-700">
                    <ExternalLink className="w-3 h-3" />
                    {source.documentName}
                  </div>
                  <p className="text-gray-600 mt-1 line-clamp-2">
                    {source.chunkText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-400 mt-1">
          {new Date(message.created_at).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
