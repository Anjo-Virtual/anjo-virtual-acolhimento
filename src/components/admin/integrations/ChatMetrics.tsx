
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MessageSquare, Users, FileText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

interface ChartData {
  day: string;
  conversations: number;
  messages: number;
}

export const ChatMetrics = () => {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      // Buscar métricas dos documentos
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('id, processed');

      if (docsError) {
        console.error('Erro ao buscar documentos:', docsError);
      }

      // Buscar conversas de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayConversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .gte('started_at', today.toISOString());

      if (convError) {
        console.error('Erro ao buscar conversas:', convError);
      }

      // Buscar total de conversas
      const { data: totalConversations, error: totalConvError } = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true });

      if (totalConvError) {
        console.error('Erro ao buscar total de conversas:', totalConvError);
      }

      // Buscar mensagens de hoje
      const { data: todayMessages, error: msgError } = await supabase
        .from('messages')
        .select('id')
        .gte('created_at', today.toISOString());

      if (msgError) {
        console.error('Erro ao buscar mensagens:', msgError);
      }

      // Atualizar métricas
      const newMetrics: MetricCard[] = [
        {
          title: "Conversas Hoje",
          value: (todayConversations?.length || 0).toString(),
          change: "+12%",
          icon: <MessageSquare className="w-5 h-5" />
        },
        {
          title: "Total de Usuários",
          value: (totalConversations?.length || 0).toString(),
          change: "+8%",
          icon: <Users className="w-5 h-5" />
        },
        {
          title: "Documentos",
          value: (documents?.length || 0).toString(),
          change: `${documents?.filter(d => d.processed).length || 0} processados`,
          icon: <FileText className="w-5 h-5" />
        },
        {
          title: "Mensagens Hoje",
          value: (todayMessages?.length || 0).toString(),
          change: "+15%",
          icon: <TrendingUp className="w-5 h-5" />
        },
      ];

      setMetrics(newMetrics);

      // Buscar dados do gráfico (últimos 7 dias)
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const chartDataPromises = Array.from({ length: 7 }, async (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        // Conversas do dia
        const { data: dayConversations } = await supabase
          .from('conversations')
          .select('id')
          .gte('started_at', date.toISOString())
          .lt('started_at', nextDate.toISOString());

        // Mensagens do dia
        const { data: dayMessages } = await supabase
          .from('messages')
          .select('id')
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        return {
          day: days[date.getDay()],
          conversations: dayConversations?.length || 0,
          messages: dayMessages?.length || 0
        };
      });

      const resolvedChartData = await Promise.all(chartDataPromises);
      setChartData(resolvedChartData);

    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-green-600">{metric.change}</p>
                </div>
                <div className="text-gray-400">
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade dos Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversations" fill="#8884d8" name="Conversas" />
                <Bar dataKey="messages" fill="#82ca9d" name="Mensagens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
