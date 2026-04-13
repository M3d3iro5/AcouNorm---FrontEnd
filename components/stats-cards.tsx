'use client'

import { Card, CardContent } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

const stats = [
  {
    label: 'Total de Ensaios',
    value: '47',
    icon: FileText,
    change: '+3 este mês',
    changeType: 'positive' as const,
  },
  {
    label: 'Concluídos',
    value: '42',
    icon: CheckCircle,
    change: '89% do total',
    changeType: 'neutral' as const,
  },
  {
    label: 'Em Rascunho',
    value: '3',
    icon: Clock,
    change: 'Aguardando dados',
    changeType: 'neutral' as const,
  },
  {
    label: 'Com Erros',
    value: '2',
    icon: AlertTriangle,
    change: 'Verificar dados',
    changeType: 'negative' as const,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        
        return (
          <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p className={`text-xs mt-1 ${
                    stat.changeType === 'positive' ? 'text-success' :
                    stat.changeType === 'negative' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
