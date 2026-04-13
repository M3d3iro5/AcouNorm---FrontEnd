import { EmailVerificationCard } from "@/components/email-verification-card";
import { AcousticBackground } from "@/components/acoustic-background";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <AcousticBackground />
      <div className="relative z-10">
        <EmailVerificationCard />
      </div>
    </div>
  );
}
