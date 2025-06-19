
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityPageLayout from "@/components/community/CommunityPageLayout";
import ForumFilters from "@/components/community/ForumFilters";
import ActivePostCard from "@/components/community/ActivePostCard";
import EmptyForumState from "@/components/community/EmptyForumState";
import { useActivePosts } from "@/hooks/useActivePosts";
import { ForumFilter } from "@/types/forum";

const ActiveForums = () => {
  const [filter, setFilter] = useState<ForumFilter>('trending');
  const { posts, loading } = useActivePosts(filter);

  return (
    <CommunityPageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Fóruns Ativos</h1>
                <p className="text-gray-600 mt-1">Discussões mais ativas da comunidade</p>
              </div>
            </div>
            
            <Link to="/comunidade/criar-post">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <MessageSquare size={16} />
                Nova Discussão
              </Button>
            </Link>
          </div>

          <ForumFilters filter={filter} onFilterChange={setFilter} />
        </div>

        {/* Lista de Posts */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Carregando discussões...</div>
            </div>
          ) : posts.length === 0 ? (
            <EmptyForumState />
          ) : (
            posts.map((post) => (
              <ActivePostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </CommunityPageLayout>
  );
};

export default ActiveForums;
