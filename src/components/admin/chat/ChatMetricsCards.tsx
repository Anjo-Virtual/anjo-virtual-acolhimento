
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Clock, TrendingUp } from "lucide-react";

interface DashboardMetrics {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  leadsGenerated: number;
  avgMessagesPerConversation: number;
}

interface ChatMetricsCardsProps {
  metrics: DashboardMetrics;
}

export const ChatMetricsCards = ({ metrics }: ChatMetricsCardsProps) => {
  const metricsData = [
    {
      title: "Total de Conversas",
      value: metrics.totalConversations,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Conversas Ativas", 
      value: metrics.activeConversations,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Total de Mensagens",
      value: metrics.totalMessages,
      icon: TrendingUp,
      color: "text-purple-600", 
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Leads Gerados",
      value: metrics.leadsGenerated,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50", 
      borderColor: "border-orange-200"
    },
    {
      title: "Média Msg/Conversa",
      value: metrics.avgMessagesPerConversation,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {metricsData.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className={`transition-all duration-200 hover:shadow-lg ${metric.borderColor} border-2`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${metric.color} transition-all duration-300`}>
                {metric.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
