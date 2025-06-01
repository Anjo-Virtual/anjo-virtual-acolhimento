
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, User, Reply } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type ForumPost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  is_pinned: boolean;
  author: {
    display_name: string;
    is_anonymous: boolean;
  };
  category: {
    name: string;
    slug: string;
    color: string;
  };
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author: {
    display_name: string;
    is_anonymous: boolean;
  };
  parent_comment_id: string | null;
  replies?: Comment[];
};

const ForumPost = () => {
  const { slug, postId } = useParams<{ slug: string; postId: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
      incrementViewCount();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          view_count,
          is_pinned,
          author:community_profiles(display_name, is_anonymous),
          category:forum_categories(name, slug, color)
        `)
        .eq('id', postId)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Erro ao carregar post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o post.",
        variant: "destructive",
      });
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select(`
          id,
          content,
          created_at,
          parent_comment_id,
          author:community_profiles(display_name, is_anonymous)
        `)
        .eq('post_id', postId)
        .eq('is_published', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organizar comentários em árvore (parent/child)
      const commentMap = new Map();
      const rootComments: Comment[] = [];

      data?.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      data?.forEach(comment => {
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies.push(commentMap.get(comment.id));
          }
        } else {
          rootComments.push(commentMap.get(comment.id));
        }
      });

      setComments(rootComments);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      await supabase
        .from('forum_posts')
        .update({ view_count: (post?.view_count || 0) + 1 })
        .eq('id', postId);
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error);
    }
  };

  const handleSubmitComment = async (parentId: string | null = null) => {
    const content = parentId ? replyContent : newComment;
    
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "O comentário não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('community_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;

      // Criar comentário
      const { error: commentError } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          author_id: profile.id,
          content: content.trim(),
          parent_comment_id: parentId
        });

      if (commentError) throw commentError;

      toast({
        title: "Sucesso",
        description: "Comentário adicionado com sucesso!",
      });

      // Limpar formulários
      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }

      // Recarregar comentários
      fetchComments();
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <User size={14} />
            {comment.author?.is_anonymous ? 'Membro Anônimo' : comment.author?.display_name}
            <Clock size={14} />
            {formatDistanceToNow(new Date(comment.created_at), { 
              addSuffix: true, 
              locale: ptBR 
            })}
          </div>
          <p className="text-gray-800 mb-2">{comment.content}</p>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
              className="text-xs"
            >
              <Reply size={14} className="mr-1" />
              Responder
            </Button>
          )}
          
          {replyingTo === comment.id && (
            <div className="mt-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escreva sua resposta..."
                rows={3}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitComment(comment.id)}
                  disabled={submitting}
                >
                  {submitting ? 'Enviando...' : 'Responder'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {comment.replies?.map(reply => renderComment(reply, depth + 1))}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Você precisa estar logado para visualizar os posts.
            </p>
            <Link to="/admin/login">
              <Button size="lg">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Post não encontrado
            </h1>
            <Link to="/comunidade">
              <Button variant="outline">Voltar à Comunidade</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Navegação */}
          <div className="mb-8">
            <Link to={`/comunidade/${post.category.slug}`}>
              <Button variant="outline" size="sm">← Voltar ao Fórum</Button>
            </Link>
          </div>

          {/* Post principal */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-8 h-8 rounded flex items-center justify-center text-xs"
                  style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
                >
                  <MessageSquare size={16} />
                </div>
                <Badge variant="secondary">{post.category.name}</Badge>
                {post.is_pinned && (
                  <Badge variant="default">Fixado</Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  {post.author?.is_anonymous ? 'Membro Anônimo' : post.author?.display_name}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDistanceToNow(new Date(post.created_at), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seção de comentários */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Comentários ({comments.length})
            </h3>

            {/* Formulário de novo comentário */}
            {user && (
              <Card>
                <CardContent className="p-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Compartilhe sua reflexão ou ofereça palavras de apoio..."
                    rows={4}
                    className="mb-4"
                  />
                  <Button
                    onClick={() => handleSubmitComment()}
                    disabled={submitting}
                  >
                    {submitting ? 'Enviando...' : 'Comentar'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Lista de comentários */}
            <div>
              {comments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Seja o primeiro a comentar e oferecer apoio.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                comments.map(comment => renderComment(comment))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
