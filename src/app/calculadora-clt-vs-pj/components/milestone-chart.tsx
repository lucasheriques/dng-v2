"use client";

import { TableHeader } from "@/app/calculadora-clt-vs-pj/components/table-inputs";
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

interface Milestone {
  name: string;
  value: number;
}

interface MilestoneChartProps {
  cltMonthlyTotal: number;
  pjMonthlyTotal: number;
  investmentRate: number;
  interestRate: number;
  milestones: Milestone[];
}

const formatYAxis = (value: number) => {
  if (value >= 1000000) {
    return `R$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `R$${(value / 1000).toFixed(0)}k`;
  }
  return `R$${value.toFixed(0)}`;
};

const formatTime = (months: number) => {
  if (months === -1) return "Mais de 30 anos";
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths}m`;
  if (remainingMonths === 0) return `${years}a`;
  return `${years}a ${remainingMonths}m`;
};

export function MilestoneChart({
  cltMonthlyTotal,
  pjMonthlyTotal,
  investmentRate,
  interestRate,
  milestones,
}: MilestoneChartProps) {
  const YEARS = 30;
  const monthlyRate = Math.pow(1 + interestRate, 1 / 12) - 1;

  const cltMonthlyInvestment = (cltMonthlyTotal * investmentRate) / 100;
  const pjMonthlyInvestment = (pjMonthlyTotal * investmentRate) / 100;

  const data = Array.from({ length: YEARS * 12 }, (_, month) => {
    const cltPatrimony =
      cltMonthlyInvestment *
      ((Math.pow(1 + monthlyRate, month + 1) - 1) / monthlyRate);
    const pjPatrimony =
      pjMonthlyInvestment *
      ((Math.pow(1 + monthlyRate, month + 1) - 1) / monthlyRate);

    return {
      month: month + 1,
      clt: cltPatrimony,
      pj: pjPatrimony,
    };
  });

  const chartConfig: ChartConfig = {
    clt: {
      label: "CLTkkkkkkkkkkk",
      color: "white",
    },
    pj: {
      label: "PJ",
      color: "white",
    },
  };

  return (
    <div className="space-y-8">
      <div className="md:max-w-[80%] mx-auto">
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
        <p className="text-sm text-secondary-text mt-4">
          Projeção baseada em {investmentRate}% do salário investido a{" "}
          {interestRate * 100}% ao ano ao longo de {YEARS} anos.
        </p>
      </div>

      <div className="hidden md:block border  rounded-lg overflow-hidden bg-slate-900/50">
        <TableHeader>Marcos Financeiros e Tempo de Investimento</TableHeader>
        <div className="grid grid-cols-4 border-b ">
          <div className="p-3 border-r  font-medium">
            <span className="text-sm">Objetivo</span>
          </div>
          <div className="p-3 border-r  text-right font-medium">
            <span className="text-sm">Valor</span>
          </div>
          <div className="p-3 border-r  text-right font-medium">
            <span className="text-sm text-chart-blue">Tempo CLT</span>
          </div>
          <div className="p-3 text-right font-medium">
            <span className="text-sm text-chart-pink">Tempo PJ</span>
          </div>
        </div>
        {milestones.map((milestone) => {
          const cltMonthsToReach = data.findIndex(
            (d) => d.clt >= milestone.value
          );
          const pjMonthsToReach = data.findIndex(
            (d) => d.pj >= milestone.value
          );

          return (
            <div
              key={milestone.name}
              className="grid grid-cols-4 border-b  last:border-b-0"
            >
              <div className="p-3 border-r ">
                <span className="text-sm">{milestone.name}</span>
              </div>
              <div className="p-3 border-r  text-right">
                <span className="text-sm text-slate-400">
                  {formatCurrency(milestone.value)}
                </span>
              </div>
              <div className="p-3 border-r  text-right">
                <span className="text-sm text-chart-blue">
                  {formatTime(cltMonthsToReach)}
                </span>
              </div>
              <div className="p-3 text-right">
                <span className="text-sm text-chart-pink">
                  {formatTime(pjMonthsToReach)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="md:hidden space-y-4">
        <h3 className="text-lg font-semibold">
          Marcos Financeiros e Tempo de Investimento
        </h3>
        {milestones.map((milestone) => {
          const cltMonthsToReach = data.findIndex(
            (d) => d.clt >= milestone.value
          );
          const pjMonthsToReach = data.findIndex(
            (d) => d.pj >= milestone.value
          );

          return (
            <div
              key={milestone.name}
              className="p-4 border  rounded-lg bg-slate-900/50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{milestone.name}</span>
                <span className="text-slate-400">
                  {formatCurrency(milestone.value)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-400">Tempo CLT</span>
                  <span className="text-blue-400">
                    {formatTime(cltMonthsToReach)}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-slate-400">Tempo PJ</span>
                  <span className="text-pink-400">
                    {formatTime(pjMonthsToReach)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
