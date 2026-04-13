"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { FrequencyData } from "@/lib/types";

interface ResultChartCardProps {
  title: string;
  data: FrequencyData[];
  yLabel?: string;
  referenceLine?: number;
}

export function ResultChartCard({
  title,
  data,
  yLabel = "dB",
  referenceLine,
}: ResultChartCardProps) {
  const chartData = data.map((d) => ({
    frequency: d.frequency,
    value: d.value,
    label:
      d.frequency >= 1000 ? `${d.frequency / 1000}k` : d.frequency.toString(),
  }));

  const minValue = Math.min(...data.map((d) => d.value)) - 5;
  const maxValue = Math.max(...data.map((d) => d.value)) + 5;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 50, bottom: 50 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#4a5568"
                opacity={0.8}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#cbd5e0", fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: "#4a5568" }}
                tickLine={{ stroke: "#4a5568" }}
                label={{
                  value: "Frequência (Hz)",
                  position: "bottom",
                  offset: 15,
                  fill: "#cbd5e0",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              />
              <YAxis
                domain={[minValue, maxValue]}
                type="number"
                tick={{ fill: "#cbd5e0", fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: "#4a5568" }}
                tickLine={{ stroke: "#4a5568" }}
                tickFormatter={(value) => {
                  if (Math.abs(value) >= 1000) {
                    return (value / 1000).toFixed(0) + "k";
                  }
                  return value.toFixed(0);
                }}
                label={{
                  value: yLabel,
                  angle: -90,
                  position: "left",
                  offset: 10,
                  fill: "#cbd5e0",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a202c",
                  border: "2px solid #3182ce",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
                labelStyle={{ color: "#90cdf4", fontWeight: 600 }}
                formatter={(value: number) => [
                  `${value.toFixed(1)} ${yLabel}`,
                  "Valor",
                ]}
                labelFormatter={(label) => `${label} Hz`}
              />
              {referenceLine && (
                <ReferenceLine
                  y={referenceLine}
                  stroke="#f56565"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00d4ff"
                strokeWidth={3}
                dot={{
                  fill: "#00d4ff",
                  strokeWidth: 2,
                  stroke: "#0a1428",
                  r: 4,
                }}
                activeDot={{
                  fill: "#00ff00",
                  strokeWidth: 2,
                  stroke: "#1a202c",
                  r: 6,
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
  );
}
