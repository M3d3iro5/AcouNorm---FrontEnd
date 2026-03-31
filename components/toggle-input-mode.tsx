'use client'

import { Button } from '@/components/ui/button'
import { InputMode } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ToggleInputModeProps {
  value: InputMode
  onChange: (mode: InputMode) => void
  disabled?: boolean
}

export function ToggleInputMode({ value, onChange, disabled }: ToggleInputModeProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange('simple')}
        disabled={disabled}
        className={cn(
          "px-4 text-sm font-medium transition-all",
          value === 'simple'
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        Entrada simplificada
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange('bands')}
        disabled={disabled}
        className={cn(
          "px-4 text-sm font-medium transition-all",
          value === 'bands'
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        Entrada por bandas
      </Button>
    </div>
  )
}
