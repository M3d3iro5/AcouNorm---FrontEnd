'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info, BookOpen, AlertCircle } from 'lucide-react'
import { TestType, TEST_TYPES } from '@/lib/types'

interface HelpPanelProps {
  testType: TestType
}

const helpContent = {
  aereo_parede: {
    title: 'Ruído Aéreo - Parede',
    badge: 'Aéreo',
    description: 'Avaliação do isolamento a ruído aéreo entre ambientes internos separados por partição vertical.',
    tips: [
      'Informe o TR60 da sala de recepção ou, alternativamente, a absorção equivalente',
      'Para ensaios de ruído aéreo, informe os níveis da sala fonte e da sala de recepção',
      'Os níveis NPS devem ser medidos conforme procedimento normalizado',
    ],
    norms: ['ISO 16283-1', 'ISO 717-1', 'NBR 15575-4'],
  },
  aereo_fachada: {
    title: 'Ruído Aéreo - Fachada',
    badge: 'Fachada',
    description: 'Avaliação do isolamento a ruído aéreo de fachadas e elementos de vedação externa, com fonte sonora posicionada no ambiente externo.',
    tips: [
      'A fonte está no lado externo e a recepção no ambiente interno',
      'Informe o NPS Externo medido próximo à fachada (a 2m)',
      'Informe o NPS Interno medido na sala de recepção',
      'Este ensaio representa isolamento de fachada a ruído aéreo',
    ],
    norms: ['ISO 16283-3', 'ISO 717-1', 'NBR 15575-4'],
  },
  impacto_laje: {
    title: 'Ruído de Impacto - Laje',
    badge: 'Impacto',
    description: 'Avaliação do isolamento a ruído de impacto em pisos e lajes entre pavimentos, utilizando máquina de impacto padronizada.',
    tips: [
      'Neste caso não há NPS de sala fonte como no ruído aéreo',
      'O cálculo considera a resposta na sala de recepção à excitação por impacto',
      'A máquina de impacto deve estar posicionada sobre o piso em teste',
    ],
    norms: ['ISO 16283-2', 'ISO 717-2', 'NBR 15575-3'],
  },
}

export function HelpPanel({ testType }: HelpPanelProps) {
  const content = helpContent[testType]
  const config = TEST_TYPES.find(t => t.id === testType)

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Ajuda Contextual
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {content.badge}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">{content.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {content.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-warning" />
              Dicas Importantes
            </h4>
            <ul className="space-y-2">
              {content.tips.map((tip, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-info" />
              Normas de Referência
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {content.norms.map((norm) => (
                <Badge key={norm} variant="secondary" className="text-xs font-mono">
                  {norm}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Preview */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Métricas Calculadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {config?.metrics.map((metric) => (
              <div
                key={metric}
                className="px-3 py-2 bg-muted/30 rounded-md text-center"
              >
                <span className="text-sm font-mono text-foreground">{metric}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Os resultados serão calculados pelo backend Python após envio dos dados.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
