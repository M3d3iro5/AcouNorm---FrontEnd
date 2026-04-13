"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";

type VerificationStep =
  | "enter-email"
  | "code-sent"
  | "verifying"
  | "verified"
  | "error";

export function EmailVerificationCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [step, setStep] = useState<VerificationStep>("enter-email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
      setStep("code-sent");
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, insira seu email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao enviar código");
      }

      setStep("code-sent");
      setResendTimer(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar código");
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (newCode.every((digit) => digit)) {
      handleVerifyCode(newCode.join(""));
    }
  };

  const handleVerifyCode = async (fullCode: string) => {
    setIsLoading(true);
    setStep("verifying");
    setError("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Código inválido");
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

      setStep("verified");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao verificar código");
      setCode(["", "", "", "", "", ""]);
      setStep("code-sent");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendTimer(60);
        setError("");
      } else {
        throw new Error("Erro ao reenviar código");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao reenviar código");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-blue-500" />
        </div>
        <CardTitle>Verificar seu Email</CardTitle>
        <CardDescription>
          {step === "enter-email" &&
            "Digite seu email para receber um código de verificação"}
          {step === "code-sent" &&
            "Insira o código de 6 dígitos enviado para seu email"}
          {step === "verified" && "Email verificado com sucesso!"}
          {step === "error" && "Ocorreu um erro na verificação"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === "enter-email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                className="bg-slate-50"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Código"
              )}
            </Button>
          </form>
        )}

        {step === "code-sent" && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
              Código enviado para <strong>{email}</strong>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Código de Verificação (6 dígitos)
              </label>
              <div className="flex gap-2 justify-between">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    disabled={isLoading}
                    className="w-12 h-12 text-center text-xl font-bold bg-slate-50"
                  />
                ))}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleResendCode}
              disabled={resendTimer > 0 || isLoading}
              variant="outline"
              className="w-full"
            >
              {resendTimer > 0
                ? `Reenviar em ${resendTimer}s`
                : "Reenviar Código"}
            </Button>

            <Link href="/">
              <Button variant="ghost" className="w-full">
                Voltar para Login
              </Button>
            </Link>
          </div>
        )}

        {step === "verifying" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-sm text-gray-600">Verificando seu email...</p>
          </div>
        )}

        {step === "verified" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-sm font-medium text-center">
              Email verificado com sucesso!
            </p>
            <p className="text-xs text-gray-500 text-center">
              Redirecionando para login...
            </p>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => setStep("enter-email")} className="w-full">
              Tentar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
