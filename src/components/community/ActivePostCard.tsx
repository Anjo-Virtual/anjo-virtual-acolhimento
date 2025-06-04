
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { ActivePost } from "@/types/forum";

interface ActivePostCardProps {
  post: ActivePost;
}

const ActivePostCard = ({ post }: ActivePostCardProps) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge 
                variant="secondary" 
                style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
              >
                {post.category.name}
              </Badge>
              <span className="text-sm text-gray-500">
                por {post.author.is_anonymous ? 'Membro Anônimo' : post.author.display_name}
              </span>
              <span className="text-sm text-gray-500">
                {formatTimeAgo(post.created_at)}
              </span>
            </div>
            <Link to={`/comunidade/post/${post.id}`}>
              <CardTitle className="text-lg mb-2 hover:text-primary transition-colors cursor-pointer">
                {post.title}
              </CardTitle>
            </Link>
            <CardDescription className="line-clamp-2">
              {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{post.view_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span>{post.replies_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>♥</span>
              <span>{post.likes_count}</span>
            </div>
          </div>
          
          {post.updated_at !== post.created_at && (
            <span className="text-xs">
              Atualizado {formatTimeAgo(post.updated_at)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivePostCard;
