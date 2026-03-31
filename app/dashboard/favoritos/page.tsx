'use client'

import { Header } from '@/components/header'
import { Breadcrumb } from '@/components/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FavoritosPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Favoritos" 
        subtitle="Ensaios marcados como favoritos para acesso rápido" 
      />
      
      <div className="p-6 space-y-6">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Favoritos' },
          ]}
        />

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Marque ensaios como favoritos para acessá-los rapidamente. 
              Você pode favoritar qualquer ensaio a partir do histórico ou da tela de resultados.
            </p>
            <Link href="/dashboard/historico">
              <Button className="gap-2">
                Ver Histórico
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
