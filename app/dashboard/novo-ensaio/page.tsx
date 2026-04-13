'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Breadcrumb } from '@/components/breadcrumb'
import { TestForm } from '@/components/test-form'
import { TestTypeSelector } from '@/components/test-type-selector'
import { ResultsPanel } from '@/components/results-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { TEST_TYPES } from '@/lib/types'

export default function NovoEnsaioPage() {
  const { selectedTestType, setSelectedTestType } = useAuth()
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  const config = TEST_TYPES.find(t => t.id === selectedTestType)

  const handleBack = () => {
    if (showResults) {
      setShowResults(false)
    } else {
      setSelectedTestType(null)
    }
  }

  const handleNewTest = () => {
    setShowResults(false)
    setSelectedTestType(null)
  }

  // Se não tiver tipo selecionado, mostrar seleção
  if (!selectedTestType) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Novo Ensaio" 
          subtitle="Selecione o tipo de avaliação acústica" 
        />
        <div className="p-6">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Novo Ensaio' },
            ]}
            className="mb-6"
          />
          <TestTypeSelector />
        </div>
      </div>
    )
  }

  // Se mostrar resultados
  if (showResults) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Resultados do Ensaio" 
          subtitle={`${config?.name} - Análise concluída`} 
        />
        <div className="p-6">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Novo Ensaio', href: '/dashboard/novo-ensaio' },
              { label: 'Resultados' },
            ]}
            className="mb-6"
          />
          <ResultsPanel 
            testType={selectedTestType} 
            onNewTest={handleNewTest}
            onEdit={() => setShowResults(false)}
          />
        </div>
      </div>
    )
  }

  // Mostrar formulário
  return (
    <div className="min-h-screen">
      <Header 
        title={config?.name || 'Novo Ensaio'} 
        subtitle={config?.description} 
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Novo Ensaio' },
              { label: config?.name || '' },
            ]}
          />
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {selectedTestType === 'impacto_laje' ? 'Impacto' : 'Aéreo'}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
        
        <TestForm 
          testType={selectedTestType} 
          onCalculated={() => setShowResults(true)} 
        />
      </div>
    </div>
  )
}
