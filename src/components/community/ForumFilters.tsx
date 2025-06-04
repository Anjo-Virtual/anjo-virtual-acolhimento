
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Users } from "lucide-react";
import { ForumFilter } from "@/types/forum";

interface ForumFiltersProps {
  filter: ForumFilter;
  onFilterChange: (filter: ForumFilter) => void;
}

const ForumFilters = ({ filter, onFilterChange }: ForumFiltersProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={filter === 'trending' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('trending')}
        className="flex items-center gap-2"
      >
        <TrendingUp size={14} />
        Em Alta
      </Button>
      <Button
        variant={filter === 'recent' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('recent')}
        className="flex items-center gap-2"
      >
        <Clock size={14} />
        Recentes
      </Button>
      <Button
        variant={filter === 'popular' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('popular')}
        className="flex items-center gap-2"
      >
        <Users size={14} />
        Populares
      </Button>
    </div>
  );
};

export default ForumFilters;
