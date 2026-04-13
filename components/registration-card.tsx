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
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
}

export function RegistrationCard() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score++;
    } else {
      feedback.push("Mínimo 8 caracteres");
    }

    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push("Adicione letras maiúsculas");
    }

    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push("Adicione letras minúsculas");
    }

    if (/[0-9]/.test(password)) {
      score++;
    } else {
      feedback.push("Adicione números");
    }

    return { score: Math.min(score, 4), feedback };
  };

  const passwordStrength = checkPasswordStrength(password);

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return "bg-muted";
    if (passwordStrength.score === 1) return "bg-destructive";
    if (passwordStrength.score === 2) return "bg-yellow-500";
    if (passwordStrength.score === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthLabel = () => {
    const labels = ["Muito fraca", "Fraca", "Média", "Forte", "Muito forte"];
    return labels[passwordStrength.score] || "Muito fraca";
  };

  const validateForm = (): boolean => {
    setError("");

    if (!fullName.trim()) {
      setError("Informe seu nome completo");
      return false;
    }

    if (fullName.trim().split(" ").length < 2) {
      setError("Informe seu nome completo (primeiro e último nome)");
      return false;
    }

    if (!email) {
      setError("Informe seu e-mail");
      return false;
    }

    if (!validateEmail(email)) {
      setError("E-mail inválido");
      return false;
    }

    if (!password) {
      setError("Informe uma senha");
      return false;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return false;
    }

    if (passwordStrength.score < 2) {
      setError("A senha é muito fraca. Use maiúsculas, minúsculas e números");
      return false;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    // 🔍 DEBUG: Mostrar o que será enviado
    console.log(`\n📝 ========== REGISTRATION DEBUG ==========`);
    console.log(`Full Name: '${fullName}'`);
    console.log(`Email: '${email}'`);
    console.log(
      `Email chars: ${Array.from(email)
        .map((c, i) => `${i}:'${c}'`)
        .join(", ")}`,
    );
    console.log(`Password length: ${password.length}`);
    console.log(`==========================================\n`);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        // Se o email já foi registrado, mostrar erro com opção de verificar
        const errorMessage =
          data.detail || data.error || "Erro ao criar conta. Tente novamente.";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        // Redireciona para verificação de email
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      console.error("Register error:", err);
      setError("Erro ao processar seu registro. Tente novamente mais tarde.");
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    // Redireciona para página de verificação com email pré-preenchido
    router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardContent className="pt-12 pb-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Cadastro realizado!
              </h2>
              <p className="text-sm text-muted-foreground">
                Verifique seu email para confirmar sua conta...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
      <CardHeader className="space-y-3 pb-6">
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
          Criar nova conta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="space-y-3 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-destructive text-sm">{error}</p>
              </div>

              {/* Se o email já foi registrado, mostrar opção para verificar */}
              {error.includes("Email já foi registrado") && email && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendCode}
                  className="w-full mt-2 border-destructive/30 hover:bg-destructive/5"
                >
                  Solicitar novo código
                </Button>
              )}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Nome Completo
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="João Silva"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              className="h-10"
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-10"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        getPasswordStrengthColor(),
                      )}
                      style={{
                        width: `${((passwordStrength.score + 1) / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {getPasswordStrengthLabel()}
                  </span>
                </div>

                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {passwordStrength.feedback.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <X className="w-3 h-3 text-destructive flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={cn(
                  "h-10 pr-10",
                  confirmPassword &&
                    password !== confirmPassword &&
                    "border-destructive",
                )}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-500 flex items-center gap-1">
                <Check className="w-3 h-3" /> Senhas coincidem
              </p>
            )}
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <X className="w-3 h-3" /> Senhas não coincidem
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-6 font-semibold"
          >
            {isLoading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/"
                className="text-primary hover:underline font-medium"
              >
                Entrar
              </Link>
            </p>
          </div>

          {/* Version info */}
          <p className="text-center text-xs text-muted-foreground/50 pt-2">
            AcouNorm v1.0.0
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
