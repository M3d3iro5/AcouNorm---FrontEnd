'use client'

import { Header } from '@/components/header'
import { TestTypeSelector } from '@/components/test-type-selector'
import { RecentTests } from '@/components/recent-tests'
import { StatsCards } from '@/components/stats-cards'

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Bem-vindo ao AcouNorm - Sistema de Análise de Isolamento Acústico" 
      />
      
      <div className="p-6 space-y-8">
        {/* Stats */}
        <StatsCards />

        {/* Test Type Selection */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Novo Ensaio</h2>
            <p className="text-sm text-muted-foreground">
              Selecione o tipo de avaliação acústica que deseja realizar
            </p>
          </div>
          <TestTypeSelector />
        </section>

        {/* Recent Tests */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Ensaios Recentes</h2>
            <p className="text-sm text-muted-foreground">
              Últimos ensaios realizados ou em rascunho
            </p>
          </div>
          <RecentTests />
        </section>
      </div>
    </div>
  )
}
