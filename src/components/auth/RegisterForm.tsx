"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { registerAction } from "@/actions/auth";
import { registerSchema, type RegisterFormData } from "@/schemas/auth";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { PasswordInput } from "../ui/password-input";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      role: "OPERACIONAL",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: RegisterFormData) {
    setError(null);
    setSuccess(null);

    const result = await registerAction(values);

    if (!result.success) {
      setError(result.error ?? "Nao foi possivel criar o usuario.");
      return;
    }

    setSuccess(result.message ?? result.data.message);
    form.reset();
    onSuccess?.();
  }

  return (
    <Card className="flex w-full max-w-lg flex-col justify-between gap-28 border-transparent bg-transparent">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-3xl">Bem-vindo ao K3D </CardTitle>
        <CardDescription className="text-muted-foreground">
          Adicione novos usuários ao sistema de gerenciamento de produção.
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

            {success ? (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        autoComplete="name"
                        placeholder="Nome"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Perfil de acesso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="OPERACIONAL">Operacional</SelectItem>
                        <SelectItem value="GERENTE">Gerente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoComplete="email"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      placeholder="Repita a senha"
                      type="password"
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
              {isSubmitting ? "Criando..." : "Criar usuario"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
