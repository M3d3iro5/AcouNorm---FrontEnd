'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { FrequencyData } from '@/lib/types'

interface ResultChartCardProps {
  title: string
  data: FrequencyData[]
  yLabel?: string
  referenceLine?: number
}

export function ResultChartCard({
  title,
  data,
  yLabel = 'dB',
  referenceLine,
}: ResultChartCardProps) {
  const chartData = data.map(d => ({
    frequency: d.frequency,
    value: d.value,
    label: d.frequency >= 1000 ? `${d.frequency / 1000}k` : d.frequency.toString(),
  }))

  const minValue = Math.min(...data.map(d => d.value)) - 5
  const maxValue = Math.max(...data.map(d => d.value)) + 5

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                label={{
                  value: 'Frequência (Hz)',
                  position: 'bottom',
                  offset: 0,
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 11,
                }}
              />
              <YAxis
                domain={[minValue, maxValue]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                label={{
                  value: yLabel,
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--popover-foreground))',
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                formatter={(value: number) => [`${value.toFixed(1)} ${yLabel}`, 'Valor']}
                labelFormatter={(label) => `${label} Hz`}
              />
              {referenceLine && (
                <ReferenceLine
                  y={referenceLine}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{
                  fill: 'hsl(var(--primary))',
                  strokeWidth: 0,
                  r: 3,
                }}
                activeDot={{
                  fill: 'hsl(var(--primary))',
                  strokeWidth: 2,
                  stroke: 'hsl(var(--background))',
                  r: 5,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Curva de isolamento por banda de frequência
        </p>
      </CardContent>
    </Card>
  )
}
