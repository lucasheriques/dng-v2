"use client";

import {
  TableHeader,
  TableInput,
  TableRow,
} from "@/app/calculadora-clt-vs-pj/components/table-inputs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
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

export default function InvestmentCalculator() {
  const [initialDeposit, setInitialDeposit] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [period, setPeriod] = useState(10);
  const [periodType, setPeriodType] = useState("anos");
  const [interestRate, setInterestRate] = useState(5.5);
  const [results, setResults] = useState({
    totalInterest: 0,
    totalContributions: 0,
    initialDeposit: 0,
    finalAmount: 0,
    chartData: [] as ChartData[],
  });

  useEffect(() => {
    // Debounce the calculation
    const handler = setTimeout(() => {
      calculateInvestment();
    }, 200); // 100ms debounce

    // Cleanup function to clear the timeout if dependencies change before it fires
    return () => {
      clearTimeout(handler);
    };
  }, [initialDeposit, monthlyContribution, period, periodType, interestRate]);

  const calculateInvestment = () => {
    const months = periodType === "anos" ? period * 12 : period;
    let currentAmount = initialDeposit;
    let totalContributions = 0;
    let totalInterest = 0;
    const chartData = [];

    for (let i = 0; i <= months; i++) {
      if (i === months) {
        // Final data for stacked bar chart
        chartData.push({
          month: i,
          initialDeposit: initialDeposit,
          contributions: totalContributions,
          interest: totalInterest,
        });
      }

      if (i < months) {
        // Monthly interest calculation
        const monthlyInterest = currentAmount * (interestRate / 100 / 12);
        totalInterest += monthlyInterest;

        // Add monthly contribution
        if (i > 0) {
          // Don't add contribution for the first month
          totalContributions += monthlyContribution;
        }

        // Update current amount
        currentAmount += monthlyContribution + monthlyInterest;
      }
    }

    setResults({
      totalInterest,
      totalContributions,
      initialDeposit,
      finalAmount: currentAmount,
      chartData,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Form on the left */}
      <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
        <TableHeader>Configurações</TableHeader>
        <TableRow label="Depósito inicial">
          <TableInput
            prefix="R$"
            value={String(initialDeposit)}
            onChange={(v) => setInitialDeposit(Number(v) || 0)}
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
              <TabsList className="grid w-full grid-cols-2 h-10 bg-slate-800">
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
      <div className="space-y-6">
        {/* First row: Chart and Breakdown side by side */}
        <div className="grid grid-cols-2 gap-6">
          {/* Chart */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-100">
              Composição do investimento:
            </h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results.chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
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
                      const labels = {
                        initialDeposit: "Depósito inicial",
                        contributions: "Contribuições mensais",
                        interest: "Juros acumulados",
                      };
                      return (
                        <span style={{ fontSize: "11px", color: "#cbd5e1" }}>
                          {labels[value as keyof typeof labels]}
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
          <div>
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
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#0ea5e9]"></div>
                  <span className="text-sm">Contribuições mensais</span>
                </div>
                <span className="font-medium text-sm text-slate-100">
                  + {formatCurrency(results.totalContributions, "BRL")}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#4338ca]"></div>
                  <span className="text-sm">Depósito inicial</span>
                </div>
                <span className="font-medium text-sm text-slate-100">
                  + {formatCurrency(results.initialDeposit, "BRL")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Second row: Total savings */}
        <div className="text-right mt-4">
          <h3 className="text-lg font-medium">Seu montante final</h3>
          <div className="text-5xl font-bold text-white">
            <NumberFlow
              value={results.finalAmount}
              format={{
                style: "currency",
                currency: "BRL",
                trailingZeroDisplay: "stripIfInteger",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
