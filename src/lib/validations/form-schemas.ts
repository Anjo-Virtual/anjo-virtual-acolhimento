
import * as z from "zod"

export const chatFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido")
})

export const whatsAppFormSchema = z.object({
  phone: z.string().min(10, "Número de WhatsApp inválido")
})

export const businessFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  empresa: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
  termos: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos"
  })
})
