import { ForgotPasswordCard } from "@/components/forgot-password-card";
import { AcousticBackground } from "@/components/acoustic-background";

export const metadata = {
  title: "Recuperar Senha - AcouNorm",
  description: "Recupere o acesso à sua conta AcouNorm",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <AcousticBackground />
      <div className="relative z-10 w-full px-4">
        <ForgotPasswordCard />
      </div>
    </div>
  );
}
