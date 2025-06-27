
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

export const ChatMetrics = () => {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: "Conversas Hoje",
      value: "24",
      change: "+12%",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      title: "Usuários Ativos",
      value: "156",
      change: "+8%",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Documentos",
      value: "12",
      change: "+2",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "Taxa de Resposta",
      value: "98%",
      change: "+2%",
      icon: <TrendingUp className="w-5 h-5" />
    },
  ]);

  const [chartData, setChartData] = useState<ChartData[]>([
    { day: "Seg", conversations: 12, messages: 45 },
    { day: "Ter", conversations: 19, messages: 67 },
    { day: "Qua", conversations: 15, messages: 52 },
    { day: "Qui", conversations: 22, messages: 78 },
    { day: "Sex", conversations: 28, messages: 89 },
    { day: "Sáb", conversations: 18, messages: 56 },
    { day: "Dom", conversations: 14, messages: 42 },
  ]);

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
