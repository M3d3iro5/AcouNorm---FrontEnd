"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { SocialLoginGrid } from "@/components/oauth-buttons";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Informe o e-mail");
      return;
    }

    if (!password) {
      setError("Informe a senha");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Credenciais inválidas");
        return;
      }

      const data = await response.json();

      // Salvar token e usuário
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      if (data.user) {
        localStorage.setItem("auth_user", JSON.stringify(data.user));
        setUser(data.user);
      }

      // Redirecionar para dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Erro ao fazer login. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-end gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-1 bg-primary rounded-full animate-wave",
                  i === 1 && "h-3",
                  i === 2 && "h-5",
                  i === 3 && "h-7",
                  i === 4 && "h-5",
                  i === 5 && "h-3",
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            AcouNorm
          </CardTitle>
        </div>
        <CardDescription className="text-center text-muted-foreground">
          Análise de Isolamento Acústico
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
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input/50 border-border focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input/50 border-border focus:border-primary pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Lembrar-me
              </Label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium glow-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </Button>

          {/* Social Login - OAuth */}
          <SocialLoginGrid />

          <div className="pt-2 border-t border-border/50">
            <p className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline font-medium"
              >
                Criar conta
              </Link>
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            Sistema para uso profissional de engenheiros e consultores acústicos
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
