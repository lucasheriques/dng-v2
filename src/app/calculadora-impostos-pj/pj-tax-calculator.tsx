"use client";

import {
  DataForm,
  DataFormHeader,
  DataFormInput,
  DataFormRow,
} from "@/components/data-forms";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { calculatePjTaxes } from "@/use-cases/calculator/pj-tax-calculations";
import { useEffect, useState } from "react";
import {
  defaultPjTaxFormData,
  PjActivityType,
  PjTaxCalculationResults,
  PjTaxFormData,
} from "./types";

interface PjTaxCalculatorClientProps {
  initialData?: PjTaxFormData;
}

export function PjTaxCalculatorClient({
  initialData,
}: PjTaxCalculatorClientProps) {
  const [formData, setFormData] = useState<PjTaxFormData>(
    initialData ?? defaultPjTaxFormData
  );
  const [results, setResults] = useState<PjTaxCalculationResults | null>(null);
  const { toast } = useToast();

  // Recalculate whenever formData changes
  useEffect(() => {
    const calculatedResults = calculatePjTaxes(formData);
    setResults(calculatedResults);
  }, [formData]);

  const handleInputChange = (
    field: keyof PjTaxFormData,
    value: string | PjActivityType
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setFormData(defaultPjTaxFormData);
    // TODO: Clear URL params if implemented
  };

  // TODO: Implement handleShare similar to CLT vs PJ calculator
  const handleShare = async () => {
    toast({
      title: "Funcionalidade em breve!",
      description: "Compartilhamento de link estará disponível em breve.",
    });
    // Implementation logic here...
  };

  return (
    <div className="grid gap-8">
      <div className="flex md:items-center justify-between md:flex-row flex-col gap-2 md:gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-highlight-text">
            Calculadora de Impostos PJ (Simples Nacional)
          </h1>
          <p className="text-muted-foreground">
            Simule os impostos da sua empresa (ME/EPP) optante pelo Simples
            Nacional.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => {
              const hyvorTalkContainer =
                document.querySelector("#hyvor-comments");
              hyvorTalkContainer?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Deixar feedback
          </Button>
          <Button variant="ghost" onClick={handleClear}>
            Limpar valores
          </Button>
        </div>
      </div>

      {/* Input Form */}
      <DataForm>
        <DataFormHeader>Dados da Empresa</DataFormHeader>
        <DataFormRow
          label="Faturamento Anual Bruto (RBT12)"
          inputId="annual-revenue-input"
          tooltipContent="Receita Bruta Total dos últimos 12 meses."
        >
          <DataFormInput
            value={formData.annualRevenue}
            onChange={(v) =>
              handleInputChange("annualRevenue", typeof v === "string" ? v : "")
            }
            prefix="R$"
            id="annual-revenue-input"
            required
            autoFocus
          />
        </DataFormRow>
        <DataFormRow
          label="Pró-labore Mensal"
          inputId="pro-labore-input"
          tooltipContent="Salário mensal retirado pelo(s) sócio(s)."
        >
          <DataFormInput
            value={formData.monthlyProLabore}
            onChange={(v) =>
              handleInputChange(
                "monthlyProLabore",
                typeof v === "string" ? v : ""
              )
            }
            prefix="R$"
            id="pro-labore-input"
            required
          />
        </DataFormRow>
        <DataFormRow
          label="Outras Despesas Mensais com Folha"
          inputId="payroll-input"
          tooltipContent="Salários de funcionários, etc. Usado para cálculo do Fator R."
        >
          <DataFormInput
            value={formData.otherMonthlyPayroll}
            onChange={(v) =>
              handleInputChange(
                "otherMonthlyPayroll",
                typeof v === "string" ? v : ""
              )
            }
            prefix="R$"
            id="payroll-input"
          />
        </DataFormRow>
        <DataFormRow
          label="Percentual Exportação (%)"
          inputId="export-percentage-input"
          tooltipContent="Percentual do faturamento vindo de exportação de serviços."
        >
          <DataFormInput
            value={formData.exportPercentage}
            onChange={(v) =>
              handleInputChange(
                "exportPercentage",
                typeof v === "string" ? v : ""
              )
            }
            prefix="%"
            id="export-percentage-input"
          />
        </DataFormRow>
        <DataFormRow
          label="Tipo de Atividade (CNAE)"
          inputId="activity-type-select"
        >
          <Select
            value={formData.activityType}
            onValueChange={(value: PjActivityType) =>
              handleInputChange("activityType", value)
            }
          >
            <SelectTrigger id="activity-type-select">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOFTWARE_FACTOR_R">
                Desenvolvimento de Software (Anexo V / Fator R)
              </SelectItem>
              <SelectItem value="NATURAL_ANEXO_III">
                Atividade Naturalmente no Anexo III
              </SelectItem>
              {/* Add more common CNAEs if needed */}
            </SelectContent>
          </Select>
        </DataFormRow>
      </DataForm>

      {/* Results Display */}
      {results && (
        <div className="grid gap-6 p-6 border rounded-lg bg-card text-card-foreground">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Resultados da Simulação</h2>
            <Button variant="secondary" onClick={handleShare}>
              Compartilhar Simulação
            </Button>
          </div>

          {/* Summary Row */}
          <div className="grid md:grid-cols-3 gap-4 text-center mb-6 p-4 rounded-lg bg-muted">
            <div>
              <Label className="text-sm text-muted-foreground">
                Anexo Aplicável
              </Label>
              <p className="text-2xl font-bold text-primary">
                Anexo {results.applicableAnexo}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Fator R</Label>
              <p
                className={`text-2xl font-bold ${results.isFatorRMet ? "text-green-500" : "text-orange-500"}`}
              >
                {formatPercentage(results.fatorR)}
                <span className="block text-xs font-normal text-muted-foreground mt-1">
                  (Necessário p/ Anexo III:{" "}
                  {formatCurrency(results.annualRevenue * 0.28)} anual /{" "}
                  {formatCurrency((results.annualRevenue * 0.28) / 12)} mensal)
                </span>
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Alíquota Efetiva Total
              </Label>
              <p className="text-2xl font-bold text-accent-secondary">
                {formatPercentage(results.effectiveTotalRate)}
              </p>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="grid md:grid-cols-3 gap-4 text-center p-4 rounded-lg bg-muted/50 border">
            <div>
              <Label className="text-sm text-muted-foreground">
                Pró-labore Líquido Mensal
              </Label>
              <p className="text-lg font-semibold text-green-500">
                {formatCurrency(results.monthlyNetProLabore)}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Distribuição de Lucros Mensal
              </Label>
              <p className="text-lg font-semibold text-green-500">
                {formatCurrency(results.monthlyProfitDistribution)}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Imposto Total Mensal
              </Label>
              <p className="text-lg font-semibold text-accent-secondary">
                {formatCurrency(results.totalMonthlyTax)}
              </p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Simples Nacional Details */}
            <div className="space-y-4 p-4 border rounded">
              <h3 className="font-semibold text-lg border-b pb-2">
                Impostos sobre Faturamento (Simples Nacional)
              </h3>
              <div className="flex justify-between">
                <span>Alíquota Efetiva Simples:</span>
                <span className="font-medium">
                  {formatPercentage(results.simplesNacional.effectiveRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Valor Total Simples:</span>
                <span className="font-medium">
                  {formatCurrency(results.simplesNacional.totalTax.total)}
                </span>
              </div>
              {results.simplesNacional.exportRevenue > 0 && (
                <div className="text-sm text-muted-foreground pt-2 space-y-1">
                  <p>
                    Faturamento Doméstico:{" "}
                    {formatCurrency(results.simplesNacional.domesticRevenue)}
                  </p>
                  <p>
                    Faturamento Exportação:{" "}
                    {formatCurrency(results.simplesNacional.exportRevenue)}
                  </p>
                  <p className="text-green-600">
                    Total Isenções (PIS/COFINS/ISS):{" "}
                    {formatCurrency(results.simplesNacional.exemptions.total)}
                  </p>
                </div>
              )}
              {/* TODO: Add optional detailed breakdown of Simples components (IRPJ, CSLL...) */}
            </div>

            {/* Pro-labore Taxes */}
            <div className="space-y-4 p-4 border rounded">
              <h3 className="font-semibold text-lg border-b pb-2">
                Impostos sobre Pró-labore
              </h3>
              <div className="flex justify-between">
                <span>INSS (Anual):</span>
                <span className="font-medium">
                  {formatCurrency(results.proLaboreTaxes.inss)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>IRPF (Anual):</span>
                <span className="font-medium">
                  {formatCurrency(results.proLaboreTaxes.irpf)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Total Pró-labore:</span>
                <span className="font-semibold">
                  {formatCurrency(results.proLaboreTaxes.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-xl font-bold">
              <span>Renda Líquida Mensal Total:</span>
              <span className="text-green-500">
                {formatCurrency(results.totalMonthlyNetIncome)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Custo Total Anual de Impostos:</span>
              <span className="text-accent-secondary">
                {formatCurrency(results.totalAnnualTax)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
