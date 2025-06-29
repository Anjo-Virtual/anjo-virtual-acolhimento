
import { Bot, MessageCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const ChatInitializingLoader = () => (
  <div className="flex items-center justify-center p-8 space-y-4 flex-col">
    <div className="relative">
      <Bot className="w-12 h-12 text-primary animate-pulse" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
    </div>
    <div className="text-center space-y-2">
      <p className="text-sm font-medium">Preparando chat...</p>
      <p className="text-xs text-gray-500">Aguarde um momento</p>
    </div>
  </div>
);

export const MessagesLoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    {/* Assistant message skeleton */}
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-gray-600" />
      </div>
      <div className="max-w-[80%] space-y-2">
        <div className="bg-gray-100 px-4 py-3 rounded-lg">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>

    {/* User message skeleton */}
    <div className="flex gap-3 flex-row-reverse">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <MessageCircle className="w-4 h-4 text-white" />
      </div>
      <div className="max-w-[80%] space-y-2 text-right">
        <div className="bg-primary px-4 py-3 rounded-lg">
          <Skeleton className="h-4 w-32 bg-primary-foreground/20" />
        </div>
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>

    {/* Another assistant message */}
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-gray-600" />
      </div>
      <div className="max-w-[80%] space-y-2">
        <div className="bg-gray-100 px-4 py-3 rounded-lg">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

export const ConversationLoadingIndicator = () => (
  <div className="flex items-center justify-center p-4 space-x-2">
    <Loader2 className="w-4 h-4 animate-spin text-primary" />
    <span className="text-sm text-gray-600">Carregando conversa...</span>
  </div>
);
