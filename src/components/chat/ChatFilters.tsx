
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";

interface ChatFiltersProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  isAdmin?: boolean;
  loading?: boolean;
}

export const ChatFilters = ({ 
  onSearch, 
  onFilterChange, 
  onClearFilters, 
  isAdmin = false,
  loading = false 
}: ChatFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("");
  const [hasLead, setHasLead] = useState<string>("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ status: value || undefined });
  };

  const handleLeadFilterChange = (value: string) => {
    setHasLead(value);
    onFilterChange({ 
      hasLead: value === 'true' ? true : value === 'false' ? false : undefined 
    });
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setStatus("");
    setHasLead("");
    onClearFilters();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Barra de busca */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Filter className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>

            <Select value={hasLead} onValueChange={handleLeadFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Leads" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="true">Com Lead</SelectItem>
                <SelectItem value="false">Sem Lead</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={handleClearAll}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
