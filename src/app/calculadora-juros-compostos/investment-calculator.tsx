"use client";

import {
  TableHeader,
  TableInput,
  TableRow,
} from "@/app/calculadora-clt-vs-pj/components/table-inputs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { InvestmentCalculatorData } from "@/lib/compression";
import { formatCurrency } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  month: number;
  initialDeposit: number;
  contributions: number;
  interest: number;
}

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

// Extracted pure calculation function
const calculateInvestmentResults = ({
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
  let totalContributions = 0;
  let totalInterest = 0;
  const chartData: ChartData[] = [];

  for (let i = 0; i <= months; i++) {
    if (i === months) {
      chartData.push({
        month: i,
        initialDeposit: initialDeposit,
        contributions: totalContributions,
        interest: totalInterest,
      });
    }

    if (i < months) {
      const monthlyInterest = currentAmount * (interestRate / 100 / 12);
      totalInterest += monthlyInterest;

      if (i > 0) {
        totalContributions += monthlyContribution;
      }

      const contributionToAdd = i > 0 ? monthlyContribution : 0;
      currentAmount += contributionToAdd + monthlyInterest;
    }
  }

  const finalAmount = initialDeposit + totalContributions + totalInterest;

  // Calculate percentages inside the function
  const interestPercent = finalAmount ? (totalInterest / finalAmount) * 100 : 0;
  const contributionsPercent = finalAmount
    ? (totalContributions / finalAmount) * 100
    : 0;
  const initialDepositPercent = finalAmount
    ? (initialDeposit / finalAmount) * 100
    : 0;

  return {
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
        <TableRow label="Depósito inicial">
          <TableInput
            prefix="R$"
            value={String(initialDeposit)}
            onChange={(v) => setInitialDeposit(Number(v) || 0)}
            autoFocus
          />
        </TableRow>
        <TableRow label="Contribuição mensal">
          <TableInput
            prefix="R$"
            value={String(monthlyContribution)}
            onChange={(v) => setMonthlyContribution(Number(v) || 0)}
          />
        </TableRow>
        <TableRow label="Período">
          <div className="flex items-center gap-0">
            <div className="flex-1">
              <TableInput
                value={String(period)}
                onChange={(v) => setPeriod(Number(v) || 0)}
              />
            </div>
            <Tabs
              defaultValue="anos"
              value={periodType}
              onValueChange={setPeriodType}
              className="w-[160px] p-2"
            >
              <TabsList className="grid w-full grid-cols-2 h-10 bg-slate-800 text-slate-300">
                <TabsTrigger value="meses">Meses</TabsTrigger>
                <TabsTrigger value="anos">Anos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </TableRow>
        <TableRow
          label="Taxa de juros anual"
          tooltipContent="A taxa média de juros para investimentos no Brasil varia entre 3% e 12% ao ano, dependendo do tipo de investimento."
        >
          <TableInput
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results.chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                  maxBarSize={128}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis tick={false} axisLine={{ stroke: "#475569" }} />
                  <YAxis
                    tickFormatter={(value) =>
                      `R$ ${(value / 1000).toLocaleString("pt-BR")}k`
                    }
                    tick={{ fontSize: 11, fill: "#cbd5e1" }} // slate-300
                    axisLine={{ stroke: "#475569" }}
                    stroke="#cbd5e1"
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${formatCurrency(Number(value), "BRL")}`,
                      name === "initialDeposit"
                        ? "Depósito inicial"
                        : name === "contributions"
                          ? "Contribuições mensais"
                          : "Juros acumulados",
                    ]}
                    labelFormatter={() => ""} // Remove label
                    contentStyle={{
                      fontSize: "12px",
                      backgroundColor: "#0f172a", // slate-900
                      borderColor: "#334155", // slate-700
                      color: "#e2e8f0", // slate-200
                    }}
                    itemStyle={{ color: "#e2e8f0" }} // slate-200
                    cursor={{ fill: "rgba(203, 213, 225, 0.1)" }} // slate-300 with alpha
                  />
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{
                      paddingBottom: "10px",
                      fontSize: "10px",
                      color: "#cbd5e1", // slate-300
                    }}
                    formatter={(value) => {
                      const labels: Record<string, string> = {
                        initialDeposit: "Depósito inicial",
                        contributions: "Contribuições mensais",
                        interest: "Juros acumulados",
                      };
                      const percentages: Record<string, number> = {
                        initialDeposit: initialDepositPercent,
                        contributions: contributionsPercent,
                        interest: interestPercent,
                      };
                      const percent =
                        percentages[value as keyof typeof percentages] ?? 0;

                      return (
                        <span style={{ fontSize: "11px", color: "#cbd5e1" }}>
                          {labels[value as keyof typeof labels]}
                          <span className="ml-1 opacity-70">
                            ({percent.toFixed(1)}%)
                          </span>
                        </span>
                      );
                    }}
                  />
                  <Bar
                    dataKey="initialDeposit"
                    stackId="a"
                    fill="#4338ca" // indigo-700
                    name="initialDeposit"
                  />
                  <Bar
                    dataKey="contributions"
                    stackId="a"
                    fill="#0ea5e9" // sky-500
                    name="contributions"
                  />
                  <Bar
                    dataKey="interest"
                    stackId="a"
                    fill="#10b981" // emerald-500
                    name="interest"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-slate-100">
              Detalhamento:
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
