
import { useParams } from "react-router-dom";
import CommunityPageLayout from "@/components/community/CommunityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Calendar } from "lucide-react";
import { usePostList } from "@/hooks/usePostList";
import PostList from "@/components/community/PostList";
import { useCommunityCategories } from "@/hooks/useCommunityCategories";

const ForumCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categories, loading: categoriesLoading } = useCommunityCategories();
  const category = categories.find(cat => cat.slug === slug);
  const { posts, loading: postsLoading, toggleLike } = usePostList({ 
    categorySlug: slug,
    limit: 20 
  });

  // Se ainda está carregando as categorias, mostrar loading
  if (categoriesLoading) {
    return (
      <CommunityPageLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando categoria...</p>
        </div>
      </CommunityPageLayout>
    );
  }

  // Se a categoria não foi encontrada
  if (!category) {
    return (
      <CommunityPageLayout>
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Categoria não encontrada</h2>
            <p className="text-gray-600">
              A categoria "{slug}" não existe ou não está ativa.
            </p>
          </CardContent>
        </Card>
      </CommunityPageLayout>
    );
  }

  return (
    <CommunityPageLayout>
      <div className="space-y-6">
        {/* Header da Categoria */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <MessageSquare size={24} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{category.name}</CardTitle>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    <span>{posts.length} discussões</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>Ativa</span>
                  </div>
                  <Badge style={{ backgroundColor: category.color, color: 'white' }}>
                    {category.name}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Lista de Posts */}
        <PostList 
          posts={posts} 
          loading={postsLoading} 
          onToggleLike={toggleLike}
          emptyMessage={`Nenhuma discussão encontrada em ${category.name}`}
        />
      </div>
    </CommunityPageLayout>
  );
};

export default ForumCategory;
