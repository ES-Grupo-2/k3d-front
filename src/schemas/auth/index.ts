import { z } from "zod";

export const userRoleSchema = z.enum(["GERENTE", "OPERACIONAL"]);

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um email valido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Informe o nome completo."),
    email: z.string().trim().email("Informe um email valido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z
      .string()
      .min(6, "Confirme a senha com pelo menos 6 caracteres."),
    role: userRoleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas nao conferem.",
    path: ["confirmPassword"],
  });

export type UserRole = z.infer<typeof userRoleSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

export interface ClientAuthSession {
  user: AuthUser;
}

export type AuthStatus = "authenticated" | "unauthenticated";

export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };
