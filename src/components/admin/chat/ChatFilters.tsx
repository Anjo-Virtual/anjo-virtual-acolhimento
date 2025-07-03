import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Calendar, Activity, TrendingUp, CheckCircle } from "lucide-react";

interface ChatFilters {
  period: 'today' | 'week' | 'month' | 'all';
  activity: 'last_24h' | 'most_active' | 'recent' | 'all';
  engagement: 'high' | 'medium' | 'low' | 'all';
  status: 'active' | 'paused' | 'completed' | 'all';
}

interface ChatFiltersProps {
  filters: ChatFilters;
  onFiltersChange: (filters: ChatFilters) => void;
  totalResults: number;
}

export const ChatFilters = ({ filters, onFiltersChange, totalResults }: ChatFiltersProps) => {
  const updateFilter = (key: keyof ChatFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== 'all').length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros Avançados
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">{getActiveFiltersCount()} ativo(s)</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro por Período */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Período
            </label>
            <Select value={filters.period} onValueChange={(value) => updateFilter('period', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Atividade */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Atividade
            </label>
            <Select value={filters.activity} onValueChange={(value) => updateFilter('activity', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_24h">Últimas 24h</SelectItem>
                <SelectItem value="most_active">Mais Ativas (+10 msg)</SelectItem>
                <SelectItem value="recent">Recentes</SelectItem>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Engajamento */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Engajamento
            </label>
            <Select value={filters.engagement} onValueChange={(value) => updateFilter('engagement', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alto (+10 msg)</SelectItem>
                <SelectItem value="medium">Médio (5-9 msg)</SelectItem>
                <SelectItem value="low">Baixo (&lt;5 msg)</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Status
            </label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resultados */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Mostrando <strong>{totalResults}</strong> resultados
          </p>
        </div>
      </CardContent>
    </Card>
  );
};