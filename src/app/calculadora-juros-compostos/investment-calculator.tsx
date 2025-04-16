"use client";

import {
  TableHeader,
  TableInput,
  TableRow,
} from "@/app/calculadora-clt-vs-pj/components/table-inputs";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { InvestmentCalculatorData } from "./types";

interface ChartData {
  month: number;
  initialDeposit: number;
  contributions: number;
  interest: number;
}

// Extracted pure calculation function
export const calculateInvestmentResults = ({
  initialDeposit,
  monthlyContribution,
  period,
  periodType,
  interestRate,
}: {
  initialDeposit: number;
  monthlyContribution: number;
  period: number;
  periodType: string;
  interestRate: number;
}) => {
  const months = periodType === "anos" ? period * 12 : period;
  let currentAmount = initialDeposit;
  let totalContributions = 0; // Tracks only monthly contributions
  let totalInterest = 0;
  const chartData: ChartData[] = [];

  // Add initial state (month 0)
  chartData.push({
    month: 0,
    initialDeposit: initialDeposit,
    contributions: 0,
    interest: 0,
  });

  // Calculate month by month from 1 up to 'months'
  for (let i = 1; i <= months; i++) {
    // 1. Add monthly contribution
    currentAmount += monthlyContribution;
    totalContributions += monthlyContribution;

    // 2. Calculate interest for the month
    const monthlyInterestRate = interestRate / 100 / 12;
    const interestEarned = currentAmount * monthlyInterestRate;
    totalInterest += interestEarned;

    // 3. Update current amount with interest
    currentAmount += interestEarned;

    // 4. Record data for the chart
    // Record data only at the end of each year (i % 12 === 0)
    // or for the very last month (i === months).
    if (i % 12 === 0 || i === months) {
      // Always use yearly/final month aggregation
      chartData.push({
        month: i,
        initialDeposit: initialDeposit, // Keep initial deposit constant for chart stack
        contributions: totalContributions, // Cumulative monthly contributions
        interest: totalInterest, // Cumulative interest
      });
    }
  }

  // Final amount is the last calculated currentAmount
  const finalAmount = currentAmount;

  // Calculate percentages based on the final amount
  const interestPercent = finalAmount ? (totalInterest / finalAmount) * 100 : 0;
  const contributionsPercent = finalAmount
    ? (totalContributions / finalAmount) * 100 // Percentage of *monthly* contributions
    : 0;
  const initialDepositPercent = finalAmount
    ? (initialDeposit / finalAmount) * 100
    : 0;

  return {
    months,
    totalInterest,
    totalContributions,
    initialDeposit,
    finalAmount,
    chartData,
    // Add percentages to the return object
    interestPercent,
    contributionsPercent,
    initialDepositPercent,
  };
};

// Default values (can be moved or duplicated if compression.ts is removed)
const defaultValues: InvestmentCalculatorData = {
  initialDeposit: 10000,
  monthlyContribution: 1000,
  period: 10,
  periodType: "anos",
  interestRate: 5.5,
};

// Component Props Interface
interface InvestmentCalculatorProps {
  initialData?: InvestmentCalculatorData;
}

// Chart configuration mapping data keys to labels and CSS variables for colors
const chartConfig = {
  initialDeposit: {
    label: "Depósito inicial",
    color: "#4338ca", // Use CSS variables
  },
  contributions: {
    label: "Contribuições mensais",
    color: "#0ea5e9", // Use CSS variables
  },
  interest: {
    label: "Juros acumulados",
    color: "#10b981", // Use CSS variables
  },
} satisfies ChartConfig;

export default function InvestmentCalculator({
  initialData,
}: InvestmentCalculatorProps) {
  const { toast } = useToast();

  // Initialize state using initialData or defaults
  const [initialDeposit, setInitialDeposit] = useState(
    initialData?.initialDeposit ?? defaultValues.initialDeposit
  );
  const [monthlyContribution, setMonthlyContribution] = useState(
    initialData?.monthlyContribution ?? defaultValues.monthlyContribution
  );
  const [period, setPeriod] = useState(
    initialData?.period ?? defaultValues.period
  );
  const [periodType, setPeriodType] = useState(
    initialData?.periodType ?? defaultValues.periodType
  );
  const [interestRate, setInterestRate] = useState(
    initialData?.interestRate ?? defaultValues.interestRate
  );

  // Debounced state for calculation inputs
  const [debouncedInputs, setDebouncedInputs] = useState({
    initialDeposit,
    monthlyContribution,
    period,
    periodType,
    interestRate,
  });

  // Effect to update debounced inputs after a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInputs({
        initialDeposit,
        monthlyContribution,
        period,
        periodType,
        interestRate,
      });
    }, 300); // 300ms debounce

    // Cleanup function to clear the timeout if inputs change before it fires
    return () => {
      clearTimeout(handler);
    };
  }, [initialDeposit, monthlyContribution, period, periodType, interestRate]);

  // Calculate results using useMemo based on debounced inputs
  const results = useMemo(() => {
    return calculateInvestmentResults(debouncedInputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInputs]);

  // Destructure percentages directly from results
  const { interestPercent, contributionsPercent, initialDepositPercent } =
    results;

  // Share function
  const handleShare = () => {
    const params = new URLSearchParams();

    // Use short keys for parameters
    if (initialDeposit !== defaultValues.initialDeposit) {
      params.set("i", String(initialDeposit)); // Use 'i'
    }
    if (monthlyContribution !== defaultValues.monthlyContribution) {
      params.set("m", String(monthlyContribution)); // Use 'm'
    }
    if (period !== defaultValues.period) {
      params.set("p", String(period)); // Use 'p'
    }
    if (periodType !== defaultValues.periodType) {
      params.set("pt", periodType); // Use 'pt'
    }
    if (interestRate !== defaultValues.interestRate) {
      params.set("r", String(interestRate)); // Use 'r'
    }

    const url = new URL(window.location.pathname, window.location.origin);
    url.search = params.toString();

    window.history.replaceState({}, "", url.toString());

    navigator.clipboard
      .writeText(url.toString())
      .then(() => {
        toast({
          title: "Link de compartilhamento copiado!",
          description:
            "O link com a sua simulação foi copiado para a área de transferência.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
        toast({
          variant: "destructive",
          title: "Falha ao copiar o link.",
          description: "Ocorreu um erro ao tentar copiar o link.",
        });
      });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
        <TableHeader>Configurações</TableHeader>
        <TableRow label="Depósito inicial" inputId="initial-deposit-input">
          <TableInput
            id="initial-deposit-input"
            prefix="R$"
            value={String(initialDeposit)}
            onChange={(v) => setInitialDeposit(Number(v) || 0)}
            autoFocus
          />
        </TableRow>
        <TableRow
          label="Contribuição mensal"
          inputId="monthly-contribution-input"
        >
          <TableInput
            id="monthly-contribution-input"
            prefix="R$"
            value={String(monthlyContribution)}
            onChange={(v) => setMonthlyContribution(Number(v) || 0)}
          />
        </TableRow>
        <TableRow label="Período" inputId="period-input">
          <div className="flex items-center gap-0">
            <div className="flex-1">
              <TableInput
                id="period-input"
                value={String(period)}
                onChange={(v) => setPeriod(Number(v) || 0)}
              />
            </div>
            <Tabs
              defaultValue="anos"
              value={periodType}
              onValueChange={setPeriodType}
              className="p-2"
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 text-slate-300 h-8">
                <TabsTrigger value="meses" className="text-xs p-1">
                  Meses
                </TabsTrigger>
                <TabsTrigger value="anos" className="text-xs p-1">
                  Anos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </TableRow>
        <TableRow
          label="Taxa de juros anual"
          tooltipContent="A taxa média de juros para investimentos no Brasil varia entre 3% e 12% ao ano, dependendo do tipo de investimento."
          inputId="interest-rate-input"
        >
          <TableInput
            id="interest-rate-input"
            suffix="%"
            value={String(interestRate)}
            onChange={(v) => setInterestRate(Number(v) || 0)}
          />
        </TableRow>
      </div>
      {/* Results on the right */}
      <div className="space-y-4">
        {/* First row: Chart and Breakdown side by side */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Chart */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4 text-slate-100">
              Composição do investimento:
            </h2>
            <div className="h-[250px] w-full">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart
                  accessibilityLayer
                  data={results.chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                  maxBarSize={128}
                >
                  <CartesianGrid vertical={false} stroke="#475569" />
                  <XAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    dataKey="month"
                    tickFormatter={(month) => {
                      if (month === 0) return "Início";
                      const year = Math.ceil(month / 12);
                      if (month === results.months && results.months % 12 !== 0)
                        return `Mês ${results.months}`;
                      return `Ano ${year}`;
                    }}
                    tick={{ fontSize: 11, fill: "#cbd5e1" }}
                    stroke="#cbd5e1"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `R$ ${(value / 1000).toLocaleString("pt-BR")}k`
                    }
                    tick={{ fontSize: 11, fill: "#cbd5e1" }}
                    axisLine={{ stroke: "#475569" }}
                    stroke="#cbd5e1"
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(203, 213, 225, 0.1)" }}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, item) => {
                          const payload = item.payload as ChartData;
                          const totalForMonth =
                            payload.initialDeposit +
                            payload.contributions +
                            payload.interest;
                          const percentage =
                            totalForMonth > 0
                              ? ((Number(value) / totalForMonth) * 100).toFixed(
                                  1
                                )
                              : 0;
                          return (
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium">
                                {formatCurrency(Number(value), "BRL")}
                                <span className="ml-1 opacity-70">
                                  ({percentage}%)
                                </span>
                              </span>
                            </div>
                          );
                        }}
                        labelFormatter={() => ""}
                        itemStyle={{ fontSize: "12px" }}
                      />
                    }
                  />
                  <ChartLegend
                    content={(
                      props // Access props provided by ChartLegend
                    ) => {
                      const { payload } = props;
                      if (!payload) return null;

                      return (
                        <ChartLegendContent>
                          {payload.map((entry: Payload, index: number) => {
                            const key =
                              entry.dataKey as keyof typeof chartConfig;
                            if (!key) return null;
                            const label =
                              chartConfig[key]?.label ?? entry.value;
                            const percentages: Record<string, number> = {
                              initialDeposit: initialDepositPercent,
                              contributions: contributionsPercent,
                              interest: interestPercent,
                            };
                            const percent =
                              percentages[key as keyof typeof percentages] ?? 0;
                            return (
                              <div
                                key={`item-${index}`}
                                className="flex items-center space-x-2 text-xs"
                              >
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-slate-300">
                                  {label}
                                  <span className="ml-1 opacity-70">
                                    ({percent.toFixed(1)}%)
                                  </span>
                                </span>
                              </div>
                            );
                          })}
                        </ChartLegendContent>
                      );
                    }}
                    verticalAlign="top"
                    wrapperStyle={{
                      paddingBottom: "10px",
                      fontSize: "10px",
                      color: "#cbd5e1",
                    }}
                  />
                  <Bar
                    dataKey="initialDeposit"
                    stackId="a"
                    fill="var(--color-initialDeposit)"
                    name="initialDeposit"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="contributions"
                    stackId="a"
                    fill="var(--color-contributions)"
                    name="contributions"
                  />
                  <Bar
                    dataKey="interest"
                    stackId="a"
                    fill="var(--color-interest)"
                    name="interest"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-slate-100">
              Detalhamento ao final do período:
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#10b981]"></div>
                  <span className="text-sm">Juros acumulados</span>
                </div>
                <span className="font-medium text-sm text-slate-100">
                  {formatCurrency(results.totalInterest, "BRL")}
                  <span className="ml-1 opacity-70">
                    ({interestPercent.toFixed(1)}%)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#0ea5e9]"></div>
                  <span className="text-sm">Contribuições mensais</span>
                </div>
                <span className="font-medium text-sm text-slate-100">
                  + {formatCurrency(results.totalContributions, "BRL")}
                  <span className="ml-1 opacity-70">
                    ({contributionsPercent.toFixed(1)}%)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#4338ca]"></div>
                  <span className="text-sm">Depósito inicial</span>
                </div>
                <span className="font-medium text-sm text-slate-100">
                  + {formatCurrency(results.initialDeposit, "BRL")}
                  <span className="ml-1 opacity-70">
                    ({initialDepositPercent.toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Second row: Total savings */}
        <div className="text-right">
          <h3 className="text-lg font-medium">Seu montante final</h3>
          <div className="text-5xl font-bold text-white pb-2">
            <NumberFlow
              value={results.finalAmount}
              format={{
                style: "currency",
                currency: "BRL",
                trailingZeroDisplay: "stripIfInteger",
              }}
              data-testid="final-amount"
              data-testvalue={results.finalAmount}
            />
          </div>
          <Button variant="outline" onClick={handleShare} className="self-end">
            <Copy className="w-4 h-4 mr-1" />
            Compartilhar resultados
          </Button>
        </div>
      </div>
    </div>
  );
}
