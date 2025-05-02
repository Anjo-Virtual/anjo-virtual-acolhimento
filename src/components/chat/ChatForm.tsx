
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { chatFormSchema } from "@/lib/validations/form-schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";

type FormData = z.infer<typeof chatFormSchema>;

interface ChatFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export const ChatForm = ({ onSubmit, isSubmitting }: ChatFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    await onSubmit(data);
  };

  return (
    <div className="animate-fadeInUp">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800">Iniciar Conversa</h3>
        <p className="text-gray-500 mt-2">Preencha seus dados para começar o acolhimento</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Nome</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Seu nome" 
                    {...field} 
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">E-mail</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="seu@email.com" 
                    {...field} 
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(00) 00000-0000" 
                    {...field} 
                    className="border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit"
            className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all hover:shadow-md mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Iniciar Chat"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
