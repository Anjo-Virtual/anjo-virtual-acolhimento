
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Trash2, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Document {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  chunks: number;
}

export const DocumentManager = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Simulação de upload - aqui você implementaria a lógica real
      for (const file of files) {
        if (file.type !== 'application/pdf') {
          toast({
            title: "Erro",
            description: "Apenas arquivos PDF são suportados",
            variant: "destructive",
          });
          continue;
        }

        // Simulação de processamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newDoc: Document = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          chunks: Math.floor(file.size / 1000) + 1, // Simulação
        };
        
        setDocuments(prev => [...prev, newDoc]);
        
        toast({
          title: "Sucesso",
          description: `${file.name} foi processado com sucesso`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar os documentos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Documento removido",
      description: "O documento foi removido da base de conhecimento",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Gerenciamento de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer flex flex-col items-center gap-2 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-8 h-8 text-gray-500" />
              <div>
                <p className="text-sm font-medium">
                  {isUploading ? 'Processando...' : 'Clique para fazer upload'}
                </p>
                <p className="text-xs text-gray-500">
                  Apenas arquivos PDF são suportados
                </p>
              </div>
            </label>
          </div>

          {/* Documents List */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Documentos na Base de Conhecimento</h4>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.size)} • {doc.chunks} chunks • 
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Visualização",
                          description: "Funcionalidade de preview será implementada",
                        });
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
