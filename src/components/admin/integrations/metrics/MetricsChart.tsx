
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  day: string;
  conversations: number;
  messages: number;
}

interface MetricsChartProps {
  data: ChartData[];
}

export const MetricsChart = ({ data }: MetricsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade dos Últimos 7 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
  );
};
