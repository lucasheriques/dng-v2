"use client";

import { calculateInvestmentResults } from "@/app/calculadora-juros-compostos/lib";
import { CalculatorsPageHeader } from "@/components/calculators/calculators-page-header";
import {
  DataForm,
  DataFormHeader,
  DataFormInput,
  DataFormRow,
} from "@/components/data-forms";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { RetirementIncomeSection } from "@/components/ui/retirement-income-section";
import { ShareButton } from "@/components/ui/share-button";
import {
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { useLocalStorage } from "usehooks-ts";
import { ChartData, InvestmentCalculatorData } from "./types";

// Dynamically import RecentComparisons
const RecentComparisons = dynamic(
  () => import("@/app/calculadora-clt-vs-pj/components/recent-comparisons"),
  {
    ssr: false,
  }
);

// Default values (can be moved or duplicated if compression.ts is removed)
const defaultValues: InvestmentCalculatorData = {
  initialDeposit: 0,
  monthlyContribution: 1000,
  period: 10,
  periodType: "years",
  interestRate: 6,
};

// Helper functions for parsing (needed for loading history)
const safeParseNumber = (
  value: string | null | undefined,
  defaultValue: number
): number => {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

const safeParsePeriodType = (
  value: string | null | undefined,
  defaultValue: "months" | "years"
): "months" | "years" => {
  if (value === "months" || value === "years") {
    return value;
  }
  return defaultValue;
};

// Component Props Interface
interface InvestmentCalculatorProps {
  initialData?: Partial<InvestmentCalculatorData>;
}

// Chart configuration mapping data keys to labels and CSS variables for colors
const chartConfig = {
  initialDeposit: {
    label: "Depósito inicial",
    color: "var(--color-chart-indigo)", // Use CSS variables
  },
  contributions: {
    label: "Contribuições mensais",
    color: "var(--color-chart-sky)", // Use CSS variables
  },
  interest: {
    label: "Juros acumulados",
    color: "var(--color-chart-emerald)", // Use CSS variables
  },
} satisfies ChartConfig;

export default function InvestmentCalculator({
  initialData,
}: InvestmentCalculatorProps) {
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
  const [periodType, setPeriodType] = useState<"months" | "years">(
    initialData?.periodType ?? defaultValues.periodType
  );
  const [interestRate, setInterestRate] = useState(
    initialData?.interestRate ?? defaultValues.interestRate
  );

  // Use localStorage to store an array of parameter strings
  const [history, setHistory] = useLocalStorage<string[]>(
    "investment-calculator-history",
    []
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

  // Helper to get param value, needed for renderHistoryItem
  const getParamValue = (
    params: URLSearchParams,
    key: string,
    defaultValue: string = ""
  ): string => {
    return params.get(key) ?? defaultValue;
  };

  // Share function
  const handleShare = async () => {
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

    // Update history in localStorage
    const paramString = params.toString();

    // Check if the item already exists in history
    if (!history.includes(paramString)) {
      const newHistory = [
        paramString,
        ...history, // Add existing history after the new item
      ].slice(0, 6); // Keep last 5 entries
      setHistory(newHistory);
    }

    try {
      await navigator.clipboard.writeText(url.toString());
      return true;
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      return false;
    }
  };

  // Function to load state from history
  const handleLoadHistory = (paramString: string) => {
    const searchParams = new URLSearchParams(paramString);

    setInitialDeposit(
      safeParseNumber(searchParams.get("i"), defaultValues.initialDeposit)
    );
    setMonthlyContribution(
      safeParseNumber(searchParams.get("m"), defaultValues.monthlyContribution)
    );
    setPeriod(safeParseNumber(searchParams.get("p"), defaultValues.period));
    setPeriodType(
      safeParsePeriodType(searchParams.get("pt"), defaultValues.periodType)
    );
    setInterestRate(
      safeParseNumber(searchParams.get("r"), defaultValues.interestRate)
    );

    // Also update the URL bar to reflect the loaded state
    const url = new URL(window.location.pathname, window.location.origin);
    url.search = paramString;
    window.history.replaceState({}, "", url.toString());
  };

  // Function to render history items for Investment Calculator
  const renderInvestmentHistoryItem = useCallback((paramString: string) => {
    const params = new URLSearchParams(paramString);
    const initial = getParamValue(
      params,
      "i",
      String(defaultValues.initialDeposit)
    );
    const monthly = getParamValue(
      params,
      "m",
      String(defaultValues.monthlyContribution)
    );
    const periodVal = getParamValue(params, "p", String(defaultValues.period));
    const periodT = getParamValue(params, "pt", defaultValues.periodType);

    return {
      title: `Inicial: ${formatCurrency(Number(initial) || 0)} / Mensal: ${formatCurrency(Number(monthly) || 0)}`,
      subtitle: `Período: ${periodVal} ${periodT === "years" ? "anos" : "meses"}`,
    };
  }, []);

  return (
    <>
      <CalculatorsPageHeader title="Calculadora de Juros Compostos" />
      <RecentComparisons
        historyItems={history}
        onLoadHistory={handleLoadHistory}
        renderHistoryItem={renderInvestmentHistoryItem}
        maxItems={3}
      />

      <DataForm>
        <DataFormHeader>Configurações</DataFormHeader>
        <DataFormRow label="Depósito inicial" inputId="initial-deposit-input">
          <DataFormInput
            id="initial-deposit-input"
            prefix="R$"
            value={String(initialDeposit)}
            onChange={(v) => setInitialDeposit(Number(v) || 0)}
            autoFocus
          />
        </DataFormRow>
        <DataFormRow
          label="Contribuição mensal"
          inputId="monthly-contribution-input"
        >
          <DataFormInput
            id="monthly-contribution-input"
            prefix="R$"
            value={String(monthlyContribution)}
            onChange={(v) => setMonthlyContribution(Number(v) || 0)}
          />
        </DataFormRow>
        <DataFormRow
          label="Período"
          inputId="period-input"
          tooltipContent="Máximo de 999 anos ou 10 mil meses"
        >
          <div className="flex items-center gap-0">
            <div className="flex-1">
              <DataFormInput
                id="period-input"
                value={String(period)}
                onChange={(v) => {
                  const num = Number(v) || 0;
                  if (periodType === "years") {
                    return setPeriod(num > 999 ? 999 : num);
                  }
                  setPeriod(num > 10000 ? 10000 : num);
                }}
              />
            </div>
            <Tabs
              defaultValue="years"
              value={periodType}
              onValueChange={(v) => setPeriodType(v as "months" | "years")}
              className="p-2"
            >
              <TabsList className="bg-slate-800 text-slate-300">
                <TabsTrigger value="months" className="text-sm py-1 px-2">
                  Meses
                </TabsTrigger>
                <TabsTrigger value="years" className="text-sm py-1 px-2">
                  Anos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DataFormRow>
        <DataFormRow
          label="Taxa de juros anual"
          tooltipContent="A taxa média de juros para investimentos no Brasil varia entre 3% e 12% ao ano, dependendo do tipo de investimento."
          inputId="interest-rate-input"
        >
          <DataFormInput
            id="interest-rate-input"
            suffix="%"
            value={String(interestRate)}
            onChange={(v) => setInterestRate(Number(v) || 0)}
          />
        </DataFormRow>
      </DataForm>
      {/* Results on the right */}
      <div className="space-y-4">
        {/* First row: Chart and Breakdown side by side */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Chart */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-xl font-bold">Composição do investimento:</h2>
            <div>
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

                      // Adjust label based on total months
                      if (results.months <= 36) {
                        // Show month number for shorter periods
                        return `Mês ${month}`;
                      } else {
                        // Show year number or final month for longer periods
                        const year = Math.ceil(month / 12);
                        // Handle the last data point if it's not exactly at a year end
                        if (
                          month === results.months &&
                          results.months % 12 !== 0
                        ) {
                          return `Mês ${results.months}`;
                        }
                        return `Ano ${year}`;
                      }
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
                    content={(props) => {
                      if (!props.payload || props.payload.length === 0) {
                        return null;
                      }
                      // Calculate total from the first payload item (all items in a stack share the same base data)
                      const payloadData = props.payload[0].payload as ChartData;
                      const totalForMonth =
                        payloadData.initialDeposit +
                        payloadData.contributions +
                        payloadData.interest;

                      // Return the complete custom tooltip structure
                      return (
                        <div className="min-w-[180px] rounded-lg border  bg-slate-900 p-2 shadow-xs text-slate-200">
                          {/* Render each item line */}
                          <div className="flex flex-col gap-1 text-xs">
                            {props.payload.map((item) => {
                              const color = item.color;
                              const label =
                                chartConfig[
                                  item.name as keyof typeof chartConfig
                                ]?.label ?? item.name;
                              const formattedValue = formatCurrency(
                                Number(item.value),
                                "BRL"
                              );
                              // Calculate percentage for this item
                              const percentage =
                                totalForMonth > 0
                                  ? (
                                      (Number(item.value) / totalForMonth) *
                                      100
                                    ).toFixed(1)
                                  : 0;

                              return (
                                <div
                                  key={item.dataKey}
                                  className="flex items-center justify-between text-xs gap-1"
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="w-2.5 h-2.5 shrink-0 rounded-[0.2rem]"
                                      style={{ backgroundColor: color }}
                                    />
                                    <span>
                                      {label === "Contribuições mensais"
                                        ? "Contribuições"
                                        : label}
                                      :
                                    </span>
                                  </div>
                                  <span>
                                    {formattedValue}
                                    <span className="text-tertiary-text ml-1">
                                      ({percentage}%)
                                    </span>
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Render the total section */}
                          <div className="mt-2 pt-2 border-t ">
                            <div className="flex items-center justify-between font-bold text-xs">
                              <span>
                                Total no{" "}
                                {results.monthlyBreakdown.length <= 36
                                  ? `mês ${payloadData.month}`
                                  : `ano ${Math.ceil(payloadData.month / 12)}`}
                                :
                              </span>
                              <span>
                                {formatCurrency(totalForMonth, "BRL")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
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
                                  <span className="ml-1 text-tertiary-text">
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
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <h2 className="text-xl font-bold">
                Detalhamento ao final do período:
              </h2>
              <div className="flex items-center justify-between py-2 border-b ">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-chart-emerald"></div>
                  <span className="text-sm">Juros acumulados</span>
                </div>
                <span className="font-medium text-sm">
                  {formatCurrency(results.totalInterest, "BRL")}
                  <span className="ml-1 text-tertiary-text">
                    ({interestPercent.toFixed(1)}%)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b ">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-chart-sky"></div>
                  <span className="text-sm">Contribuições mensais</span>
                </div>
                <span className="font-medium text-sm">
                  + {formatCurrency(results.totalContributions, "BRL")}
                  <span className="ml-1 text-tertiary-text">
                    ({contributionsPercent.toFixed(1)}%)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b ">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-chart-indigo"></div>
                  <span className="text-sm">Depósito inicial</span>
                </div>
                <span className="font-medium text-sm">
                  + {formatCurrency(results.initialDeposit, "BRL")}
                  <span className="ml-1 text-tertiary-text">
                    ({initialDepositPercent.toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-medium">
                Seu montante final
              </h3>
              <div className="text-xl sm:text-5xl font-bold pb-2">
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
              <ShareButton onShare={handleShare} className="self-end" />
            </div>
          </div>
        </div>

        {/* Retirement Income Calculations */}
        <RetirementIncomeSection finalAmount={results.finalAmount} />

        {/* Second row: Total savings */}
      </div>

      <Accordion type="single" collapsible className="p-0">
        <AccordionItem value="item-1">
          <AccordionTrigger>Detalhamento mensal</AccordionTrigger>
          <AccordionContent>
            {results.monthlyBreakdown && results.monthlyBreakdown.length > 0 ? (
              <div className="max-h-96 overflow-y-auto nice-scrollbar">
                <Table className="w-full text-sm">
                  <ShadcnTableHeader>
                    <ShadcnTableRow>
                      <TableHead className="w-[60px]">Mês</TableHead>
                      <TableHead className="text-right">
                        Valor Investido
                      </TableHead>
                      <TableHead className="text-right">
                        Juros (Valor / %)
                      </TableHead>
                      <TableHead className="text-right">Total no Mês</TableHead>
                    </ShadcnTableRow>
                  </ShadcnTableHeader>
                  <TableBody>
                    {results.monthlyBreakdown.map((item) => (
                      <ShadcnTableRow
                        key={item.month}
                        className="even:bg-slate-800/50"
                      >
                        <TableCell>{item.month}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.cumulativeInvested, "BRL")}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.monthlyInterestValue, "BRL")}
                          <span className="ml-1 text-xs text-tertiary-text">
                            ({item.monthlyInterestPercent.toFixed(2)}%)
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.endOfMonthTotal, "BRL")}
                        </TableCell>
                      </ShadcnTableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-slate-400 text-sm p-4">
                Nenhum dado para exibir.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
