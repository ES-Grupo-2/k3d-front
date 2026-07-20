"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginAction } from "@/actions/auth";
import { loginSchema, type LoginFormData } from "@/schemas/auth";
import { useAuthStore } from "@/store/auth/index";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@/components/ui";
import { PasswordInput } from "../ui/password-input";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: LoginFormData) {
    setError(null);

    const result = await loginAction(values);

    if (!result.success) {
      setError(result.error ?? "Nao foi possivel fazer login.");
      return;
    }

    login({ user: result.data.user });
    onSuccess?.();
  }

  return (
    <Card className="flex w-full max-w-lg flex-col justify-between gap-28 border-transparent bg-transparent">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-3xl">Bem vindo ao K3D</CardTitle>
        <CardDescription className="text-muted-foreground">
          Acesse sua conta para gerenciar o processo de produção!
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoComplete="username"
                      placeholder="E-mail"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder="Senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="pt-6">
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
