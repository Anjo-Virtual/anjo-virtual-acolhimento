import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from "@/types/blog";

export const useBlogForm = (id?: string) => {
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [post, setPost] = useState<BlogPost>({
    title: "",
    description: "",
    content: "",
    category: "",
    published: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  const loadPost = async (postId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      
      if (data) {
        setPost({
          id: data.id,
          title: data.title,
          description: data.description,
          content: data.content,
          category: data.category,
          published: data.published,
          image_url: data.image_url
        });

        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar post:", error);
      toast({
        title: "Erro ao carregar post",
        description: "Não foi possível carregar os dados do post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setPost(prev => ({ ...prev, published: checked }));
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setPost(prev => ({ ...prev, image_url: null }));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) {
      // If no new image and we're keeping existing one
      return post.image_url || null;
    }

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw new Error("Falha ao fazer upload da imagem");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Upload image if selected
      let imageUrl = null;
      if (imageFile || post.image_url) {
        imageUrl = await uploadImage();
      }

      const postData = {
        title: post.title,
        description: post.description,
        content: post.content,
        category: post.category,
        published: post.published,
        image_url: imageUrl,
        author_id: user.id,
      };

      let result;
      
      if (isEdit) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
      } else {
        // Insert new post
        result = await supabase
          .from('blog_posts')
          .insert(postData);
      }

      if (result.error) throw result.error;

      toast({
        title: isEdit ? "Post atualizado" : "Post criado",
        description: isEdit 
          ? "O post foi atualizado com sucesso." 
          : "O post foi criado com sucesso.",
      });

      navigate("/admin/blog");
    } catch (error: any) {
      console.error("Erro ao salvar post:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar o post.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    post,
    isEdit,
    isLoading,
    isSaving,
    imagePreview,
    handleChange,
    handleSwitchChange,
    handleImageChange,
    removeImage,
    handleSubmit,
    navigate,
  };
};
