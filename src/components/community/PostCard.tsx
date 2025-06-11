
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  author: {
    display_name: string;
    is_anonymous: boolean;
  };
  category: {
    name: string;
    slug: string;
    color: string;
  };
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
};

interface PostCardProps {
  post: Post;
  onToggleLike: (postId: string) => void;
}

const PostCard = ({ post, onToggleLike }: PostCardProps) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {post.author?.is_anonymous ? 'A' : post.author?.display_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{ backgroundColor: `${post.category.color}15`, color: post.category.color }}
              >
                {post.category.name}
              </Badge>
              <span className="text-sm text-gray-500">
                {post.author?.is_anonymous ? 'Membro Anônimo' : post.author?.display_name}
              </span>
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            </div>

            <Link 
              to={`/comunidade/post/${post.id}`}
              className="block hover:text-primary transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>
            </Link>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {post.content.substring(0, 200)}
              {post.content.length > 200 && '...'}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleLike(post.id)}
                className={`flex items-center space-x-1 h-auto p-0 ${
                  post.user_has_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart size={16} className={post.user_has_liked ? 'fill-current' : ''} />
                <span>{post.likes_count}</span>
              </Button>
              
              <Link 
                to={`/comunidade/post/${post.id}`}
                className="flex items-center space-x-1 hover:text-primary transition-colors"
              >
                <MessageSquare size={16} />
                <span>{post.comments_count}</span>
              </Link>

              <div className="flex items-center space-x-1">
                <Eye size={16} />
                <span>{post.view_count}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
