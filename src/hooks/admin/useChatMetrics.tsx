
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Users, FileText, TrendingUp } from "lucide-react";

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

export const useChatMetrics = () => {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    loadMetrics();
  }, []);

  return {
    metrics,
    chartData,
    isLoading,
    loadMetrics
  };
};
