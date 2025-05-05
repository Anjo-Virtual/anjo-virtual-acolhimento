
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  onRemoveImage: () => void;
}

export const ImageUploader = ({ 
  imagePreview, 
  onImageChange, 
  onRemoveImage 
}: ImageUploaderProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro ao carregar imagem",
        description: "A imagem deve ter menos de 5MB.",
        variant: "destructive",
      });
      return;
    }

    onImageChange(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Imagem</Label>
      <div className="mt-1 flex items-center gap-6">
        <div>
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      onRemoveImage();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-xs text-gray-600">
                    Adicionar imagem
                  </span>
                </div>
              )}
            </div>
          </label>
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />
        </div>
        <div className="text-sm text-gray-500">
          <p>Formatos aceitos: JPG, PNG, GIF</p>
          <p>Tamanho máximo: 5MB</p>
        </div>
      </div>
    </div>
  );
};
