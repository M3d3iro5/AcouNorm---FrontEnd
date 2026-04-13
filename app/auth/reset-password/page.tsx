import { ResetPasswordCard } from "@/components/reset-password-card";
import { AcousticBackground } from "@/components/acoustic-background";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resetar Senha - AcouNorm",
  description: "Crie uma nova senha para sua conta AcouNorm",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <AcousticBackground />
      <div className="relative z-10 w-full px-4">
        <ResetPasswordCard />
      </div>
    </div>
  );
}
