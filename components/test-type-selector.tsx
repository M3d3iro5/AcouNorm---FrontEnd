'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Building2, Layers, Square } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { TEST_TYPES, TestType } from '@/lib/types'
import { cn } from '@/lib/utils'

const iconMap = {
  wall: Square,
  building: Building2,
  layers: Layers,
}

export function TestTypeSelector() {
  const { setSelectedTestType } = useAuth()
  const router = useRouter()

  const handleSelect = (type: TestType) => {
    setSelectedTestType(type)
    router.push('/dashboard/novo-ensaio')
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {TEST_TYPES.map((testType) => {
        const Icon = iconMap[testType.icon as keyof typeof iconMap]
        
        return (
          <Card
            key={testType.id}
            className={cn(
              "group cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
              "bg-card/50 backdrop-blur-sm border-border"
            )}
            onClick={() => handleSelect(testType.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {testType.id === 'impacto_laje' ? 'Impacto' : 'Aéreo'}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-4 group-hover:text-primary transition-colors">
                {testType.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {testType.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Métricas calculadas:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {testType.metrics.slice(0, 4).map((metric) => (
                      <Badge key={metric} variant="outline" className="text-xs font-mono">
                        {metric}
                      </Badge>
                    ))}
                    {testType.metrics.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{testType.metrics.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  className="w-full justify-between group-hover:bg-primary/10 group-hover:text-primary"
                >
                  Selecionar
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
