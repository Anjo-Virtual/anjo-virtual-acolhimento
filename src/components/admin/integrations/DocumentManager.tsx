
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Trash2, Eye, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Document {
  id: string;
  name: string;
  file_size: number;
  upload_date: string;
  processed: boolean;
  chunk_count: number;
  file_path: string;
}

export const DocumentManager = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Carregar documentos existentes
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Erro ao carregar documentos:', error);
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of files) {
        if (file.type !== 'application/pdf') {
          toast({
            title: "Erro",
            description: "Apenas arquivos PDF são suportados",
            variant: "destructive",
          });
          continue;
        }

        // Upload para storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Erro no upload:', uploadError);
          toast({
            title: "Erro no upload",
            description: `Erro ao fazer upload de ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        // Registrar documento no banco
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .insert({
            name: file.name,
            file_path: fileName,
            file_size: file.size,
            mime_type: file.type,
            processed: false,
            chunk_count: 0
          })
          .select()
          .single();

        if (docError) {
          console.error('Erro ao registrar documento:', docError);
          toast({
            title: "Erro",
            description: `Erro ao registrar ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        toast({
          title: "Upload realizado",
          description: `${file.name} foi enviado com sucesso`,
        });

        // Processar documento automaticamente
        await processDocument(docData.id);
      }
      
      // Recarregar lista de documentos
      await loadDocuments();
      
    } catch (error) {
      console.error('Erro geral no upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar os documentos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Limpar input
      event.target.value = '';
    }
  };

  const processDocument = async (documentId: string) => {
    setIsProcessing(documentId);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: { documentId }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Documento processado",
        description: `Documento dividido em ${data.chunks} chunks`,
      });

      // Recarregar documentos
      await loadDocuments();

    } catch (error) {
      console.error('Erro ao processar documento:', error);
      toast({
        title: "Erro no processamento",
        description: "Erro ao processar documento",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const deleteDocument = async (document: Document) => {
    try {
      // Deletar arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error('Erro ao deletar do storage:', storageError);
      }

      // Deletar registro do banco (chunks são deletados automaticamente por CASCADE)
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Documento removido",
        description: "O documento foi removido da base de conhecimento",
      });

      // Recarregar lista
      await loadDocuments();
      
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover documento",
        variant: "destructive",
      });
    }
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
                  {isUploading ? 'Fazendo upload...' : 'Clique para fazer upload'}
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
              <h4 className="font-medium text-sm text-gray-700">
                Documentos na Base de Conhecimento ({documents.length})
              </h4>
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
                        {formatFileSize(doc.file_size)} • 
                        {doc.processed ? (
                          <span className="text-green-600 inline-flex items-center gap-1 ml-1">
                            <CheckCircle className="w-3 h-3" />
                            {doc.chunk_count} chunks
                          </span>
                        ) : (
                          <span className="text-yellow-600 inline-flex items-center gap-1 ml-1">
                            <Clock className="w-3 h-3" />
                            Processando...
                          </span>
                        )} • 
                        {new Date(doc.upload_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!doc.processed && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => processDocument(doc.id)}
                        disabled={isProcessing === doc.id}
                      >
                        {isProcessing === doc.id ? 'Processando...' : 'Processar'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteDocument(doc)}
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
