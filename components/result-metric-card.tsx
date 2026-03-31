'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResultMetricCardProps {
  name: string
  value: number
  unit: string
  description?: string
  highlight?: boolean
}

export function ResultMetricCard({
  name,
  value,
  unit,
  description,
  highlight = false,
}: ResultMetricCardProps) {
  return (
    <Card className={cn(
      "bg-card/50 backdrop-blur-sm border-border transition-all",
      highlight && "border-primary/50 shadow-lg shadow-primary/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-sm font-mono text-muted-foreground">{name}</span>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn(
            "text-3xl font-bold tracking-tight",
            highlight ? "text-primary" : "text-foreground"
          )}>
            {value.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground font-mono">{unit}</span>
        </div>
      </CardContent>
    </Card>
  )
}
