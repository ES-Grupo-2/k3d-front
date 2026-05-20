import {z} from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string().min(5, 'A senha deve ter pelo menos 5 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string().min(5, 'A senha deve ter pelo menos 5 caracteres'),
  confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  ;

export type RegisterFormData = z.infer<typeof registerSchema>;