'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FREQUENCY_BANDS, FrequencyData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FrequencyBandTableProps {
  label: string
  data: FrequencyData[]
  onChange: (data: FrequencyData[]) => void
  unit?: string
  error?: string
  disabled?: boolean
}

export function FrequencyBandTable({
  label,
  data,
  onChange,
  unit = 'dB',
  error,
  disabled = false,
}: FrequencyBandTableProps) {
  const handleValueChange = (frequency: number, value: string) => {
    const newData = data.map((item) => {
      if (item.frequency === frequency) {
        return {
          ...item,
          value: value === '' ? 0 : parseFloat(value) || 0
        }
      }
      return item
    })
    onChange(newData)
  }

  // Initialize data if empty
  const tableData = data.length > 0 ? data : FREQUENCY_BANDS.map(f => ({ frequency: f, value: 0 }))

  return (
    <Card className="bg-card/30 border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {label} <span className="text-muted-foreground font-normal">({unit})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground py-2 px-2 w-24">
                  Frequência
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-2 px-2">
                  Valor ({unit})
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr
                  key={item.frequency}
                  className={cn(
                    "border-b border-border/50 last:border-0",
                    index % 2 === 0 ? "bg-muted/10" : ""
                  )}
                >
                  <td className="py-2 px-2">
                    <Label className="text-sm font-mono text-foreground">
                      {item.frequency} Hz
                    </Label>
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="number"
                      value={item.value || ''}
                      onChange={(e) => handleValueChange(item.frequency, e.target.value)}
                      placeholder="0.0"
                      step="0.1"
                      disabled={disabled}
                      className="h-8 w-24 bg-input/50 border-border font-mono text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && (
          <p className="text-xs text-destructive mt-2">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}
