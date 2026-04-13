'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ResultMetricCard } from '@/components/result-metric-card'
import { ResultChartCard } from '@/components/result-chart-card'
import { FormSection } from '@/components/form-section'
import { CheckCircle, Download, PlusCircle, Edit, Clock, FileText } from 'lucide-react'
import { TestType, TEST_TYPES } from '@/lib/types'
import { mockResults } from '@/lib/mock-data'

interface ResultsPanelProps {
  testType: TestType
  onNewTest: () => void
  onEdit: () => void
}

export function ResultsPanel({ testType, onNewTest, onEdit }: ResultsPanelProps) {
  const result = mockResults[testType]
  const config = TEST_TYPES.find(t => t.id === testType)

  if (!result) return null

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card className="bg-success/10 border-success/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Cálculo concluído com sucesso</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Processado em {new Date(result.processedAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              {config?.name}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Métricas Principais</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {result.metrics.map((metric, index) => (
            <ResultMetricCard
              key={metric.name}
              name={metric.name}
              value={metric.value}
              unit={metric.unit}
              description={metric.description}
              highlight={index === 0 || metric.name.includes(',w')}
            />
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResultChartCard
        title="Curva de Isolamento por Frequência"
        data={result.frequencyData}
        yLabel="dB"
      />

      {/* Classification */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Classificação do Desempenho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold text-foreground">{result.classification}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Conforme critérios normativos aplicáveis ao tipo de ensaio
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {result.metrics[0]?.name}: {result.metrics[0]?.value.toFixed(0)} {result.metrics[0]?.unit}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Technical Summary */}
      <FormSection title="Resumo Técnico do Ensaio">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryItem label="Tipo de Ensaio" value={config?.name || '-'} />
          <SummaryItem label="ID do Resultado" value={result.id} mono />
          <SummaryItem label="Status" value="Sucesso" />
          <SummaryItem label="Processamento" value="Backend Python" />
        </div>
        <div className="p-3 rounded-md bg-info/10 border border-info/20 mt-4">
          <p className="text-sm text-info">
            Nota: Os resultados apresentados foram calculados pelo backend Python conforme as normas técnicas 
            ISO 16283 e ISO 717, aplicáveis ao tipo de ensaio selecionado.
          </p>
        </div>
      </FormSection>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-4">
        <Button className="gap-2 glow-primary">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
        <Button variant="outline" onClick={onNewTest} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Novo Ensaio
        </Button>
        <Button variant="ghost" onClick={onEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Editar Dados
        </Button>
      </div>
    </div>
  )
}

function SummaryItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-3 py-2 rounded-md bg-muted/30">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium text-foreground ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}
