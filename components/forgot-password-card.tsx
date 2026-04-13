"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Informe seu e-mail");
      return;
    }

    if (!validateEmail(email)) {
      setError("E-mail inválido");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Erro ao processar solicitação");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Erro ao processar solicitação. Tente novamente mais tarde.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardContent className="pt-12 pb-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Email enviado!
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Verifique sua caixa de entrada para o link de recuperação.
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                O link expira em 1 hora.
              </p>
            </div>
            <Link href="/login" className="w-full">
              <Button className="w-full" variant="default">
                Voltar ao Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/login"
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Recuperar Senha
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Digite seu e-mail para receber um link de recuperação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail Cadastrado
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input/50 border-border focus:border-primary"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Enviando...
              </span>
            ) : (
              "Enviar Link de Recuperação"
            )}
          </Button>

          <div className="pt-2 border-t border-border/50">
            <p className="text-sm text-center text-muted-foreground">
              Lembrou sua senha?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
