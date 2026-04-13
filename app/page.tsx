'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginCard } from '@/components/login-card'
import { AcousticBackground } from '@/components/acoustic-background'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AcousticBackground />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <LoginCard />
        
        {/* Version info */}
        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          AcouNorm v1.0.0 - Sistema preparado para backend Python
        </p>
      </div>
    </main>
  )
}
