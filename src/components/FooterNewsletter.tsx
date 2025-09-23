
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail, checkRateLimit, getClientIP, sanitizeInput } from "@/utils/security";

const newsletterSchema = z.object({
  email: z.string().email("Email inválido"),
});

type FormData = z.infer<typeof newsletterSchema>;

const FooterNewsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Enhanced security validation
      if (!validateEmail(data.email)) {
        form.setError("email", { message: "Email inválido" });
        setIsSubmitting(false);
        return;
      }

      // Rate limiting check
      const clientId = getClientIP();
      if (!checkRateLimit(`newsletter_${clientId}`, 2, 5 * 60 * 1000)) { // 2 submissions per 5 minutes
        toast({
          title: "Limite excedido",
          description: "Aguarde alguns minutos antes de tentar novamente.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Sanitize input
      const sanitizedEmail = sanitizeInput(data.email);
      
      const { error } = await supabase
        .from('newsletter_subscriptions' as any)
        .insert({
          email: sanitizedEmail,
        } as any);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está inscrito em nossa newsletter.",
          });
          form.reset();
          return;
        }
        throw error;
      }
      
      toast({
        title: "Inscrição confirmada",
        description: "Você foi inscrito em nossa newsletter com sucesso.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Erro ao inscrever na newsletter:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="flex-1 px-4 py-2 rounded-l border-none text-gray-800" 
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="bg-primary text-white px-4 py-2 rounded-r hover:bg-opacity-90 transition-colors whitespace-nowrap"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Assinar"}
        </Button>
      </form>
    </Form>
  );
};

export default FooterNewsletter;
