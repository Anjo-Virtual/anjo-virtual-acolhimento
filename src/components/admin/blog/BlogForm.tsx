
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { BlogPost } from "@/types/blog";

interface BlogFormProps {
  post: BlogPost;
  isEdit: boolean;
  isSaving: boolean;
  onPostChange: (name: string, value: any) => void;
  onSwitchChange: (checked: boolean) => void;
  onImageChange: (file: File | null) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  imagePreview: string | null;
}

export const BlogForm = ({
  post,
  isEdit,
  isSaving,
  onPostChange,
  onSwitchChange,
  onImageChange,
  onRemoveImage,
  onSubmit,
  onCancel,
  imagePreview
}: BlogFormProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onPostChange(name, value);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            placeholder="Digite o título do post"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={post.description}
            onChange={handleChange}
            placeholder="Uma breve descrição do conteúdo"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            name="category"
            value={post.category}
            onChange={handleChange}
            placeholder="Ex: Dicas, Guia, Notícias"
            required
          />
        </div>

        <ImageUploader 
          imagePreview={imagePreview} 
          onImageChange={onImageChange}
          onRemoveImage={onRemoveImage}
        />
        
        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            placeholder="Escreva o conteúdo completo do post"
            className="min-h-[300px]"
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="published" 
            checked={post.published}
            onCheckedChange={onSwitchChange}
          />
          <Label htmlFor="published">Publicar imediatamente</Label>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEdit ? "Atualizar" : "Salvar"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
