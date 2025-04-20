"use client";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MilestoneChartProps {
  data: Array<{ month: number; clt: number; pj: number }>;
  chartConfig: ChartConfig;
}

const formatYAxis = (value: number) => {
  if (value >= 1000000) {
    return `R$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `R$${(value / 1000).toFixed(0)}k`;
  }
  return `R$${value.toFixed(0)}`;
};

export const formatTime = (months: number, period: number) => {
  if (months === -1) return `Mais de ${period} anos`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths}m`;
  if (remainingMonths === 0) return `${years}a`;
  return `${years}a ${remainingMonths}m`;
};

export function MilestoneChart({ data, chartConfig }: MilestoneChartProps) {
  return (
    <div>
      <div className="mx-auto">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 12,
              left: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(month) => `${Math.floor(month / 12)}a`}
              stroke="#64748b"
              fontSize={12}
              ticks={[0, 60, 120, 180, 240, 300, 360]}
            />
            <YAxis
              tickFormatter={formatYAxis}
              stroke="#64748b"
              fontSize={12}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <Tooltip
              cursor={false}
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(month) =>
                `${Math.floor(month / 12)} anos e ${month % 12} meses`
              }
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="clt"
              name="CLT"
              stroke="var(--chart-blue)"
              fill="url(#cltGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: "var(--chart-blue)",
              }}
            />
            <Area
              type="monotone"
              dataKey="pj"
              name="PJ"
              stroke="var(--chart-pink)"
              fill="url(#pjGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: "var(--chart-pink)",
              }}
            />
            <defs>
              <linearGradient id="cltGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pjGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
