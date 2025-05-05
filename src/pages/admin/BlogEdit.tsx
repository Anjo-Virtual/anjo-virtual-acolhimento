
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { BlogForm } from "@/components/admin/blog/BlogForm";
import { useBlogForm } from "@/hooks/blog/useBlogForm";

const BlogEdit = () => {
  const { id } = useParams();
  const {
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
    navigate
  } = useBlogForm(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? "Editar Post" : "Novo Post"}</h1>
        <Button variant="outline" onClick={() => navigate("/admin/blog")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{isEdit ? "Editar Publicação" : "Nova Publicação"}</CardTitle>
          <CardDescription>
            {isEdit 
              ? "Atualize as informações da sua publicação" 
              : "Preencha as informações para criar uma nova publicação"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm 
            post={post}
            isEdit={isEdit}
            isSaving={isSaving}
            onPostChange={handleChange}
            onSwitchChange={handleSwitchChange}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin/blog")}
            imagePreview={imagePreview}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogEdit;
