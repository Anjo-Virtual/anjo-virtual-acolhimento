
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { usePostList } from "@/hooks/usePostList";
import PostListSkeleton from "./PostListSkeleton";
import PostCard from "./PostCard";

interface PostListProps {
  categorySlug?: string;
  limit?: number;
}

const PostList = ({ categorySlug, limit }: PostListProps) => {
  const { posts, loading, toggleLike } = usePostList({ categorySlug, limit });

  if (loading) {
    return <PostListSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma discussão encontrada
          </h3>
          <p className="text-gray-500">
            Seja o primeiro a compartilhar nesta categoria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onToggleLike={toggleLike}
        />
      ))}
    </div>
  );
};

export default PostList;
