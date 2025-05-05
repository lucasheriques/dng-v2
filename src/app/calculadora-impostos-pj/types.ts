export type PjActivityType = "SOFTWARE_FACTOR_R" | "NATURAL_ANEXO_III";

export interface PjTaxFormData {
  annualRevenue: string;
  monthlyProLabore: string;
  otherMonthlyPayroll: string; // Expenses like employee salaries contributing to Fator R
  exportPercentage: string; // 0-100
  activityType: PjActivityType;
}

export const defaultPjTaxFormData: PjTaxFormData = {
  annualRevenue: "180000",
  monthlyProLabore: "5040", // 28% of 180k / 12
  otherMonthlyPayroll: "0",
  exportPercentage: "0",
  activityType: "SOFTWARE_FACTOR_R",
};

// Structure for detailed tax breakdown
export interface TaxBreakdown {
  irpj: number; // Imposto de Renda Pessoa Jurídica
  csll: number; // Contribuição Social sobre o Lucro Líquido
  cofins: number; // Contribuição para o Financiamento da Seguridade Social
  pisPasep: number; // Programa de Integração Social / Programa de Formação do Patrimônio do Servidor Público
  cpp: number; // Contribuição Patronal Previdenciária
  iss: number; // Imposto Sobre Serviços
  total: number;
}

// Structure for calculation results
export interface PjTaxCalculationResults {
  formData: PjTaxFormData;
  annualRevenue: number;
  monthlyProLabore: number;
  totalAnnualPayroll: number;
  fatorR: number; // Percentage (e.g., 0.28)
  isFatorRMet: boolean;
  applicableAnexo: "III" | "V";
  simplesNacional: {
    domesticRevenue: number;
    exportRevenue: number;
    effectiveRate: number; // Overall effective rate after exemptions
    domesticTax: TaxBreakdown;
    exportTax: TaxBreakdown; // Taxes applicable on export revenue
    totalTax: TaxBreakdown;
    exemptions: TaxBreakdown; // PIS, COFINS, ISS amounts exempted on export
  };
  proLaboreTaxes: {
    inss: number; // Annual INSS on pro-labore
    irpf: number; // Annual IRPF on pro-labore
    total: number;
  };
  totalAnnualTax: number;
  effectiveTotalRate: number; // Overall effective rate (Simples + INSS + IRPF) / Revenue

  // Monthly breakdown
  monthlyNetProLabore: number;
  monthlyProfitDistribution: number;
  totalMonthlyNetIncome: number;
  totalMonthlyTax: number;
}
