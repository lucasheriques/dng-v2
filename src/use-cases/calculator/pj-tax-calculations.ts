import {
  PjTaxCalculationResults,
  PjTaxFormData,
  TaxBreakdown,
} from "@/app/calculadora-impostos-pj/types";
import {
  ANEXO_III_RATES,
  ANEXO_V_RATES,
  EXPORT_EXEMPT_TAXES,
  SimplesNacionalRateBracket,
} from "./pj-tax-rates";
import { calculateINSS, calculateIRRF } from "./salary-calculations"; // Reuse INSS/IRPF logic

// Helper function to safely parse string to number
function safeParseFloat(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/\./g, "").replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// Helper to find the correct rate bracket
function findBracket(
  revenue: number,
  rates: SimplesNacionalRateBracket[]
): SimplesNacionalRateBracket | undefined {
  // Simples Nacional uses the last 12 months revenue (RBT12) to determine the bracket
  // For simplicity in this calculator, we'll use the *annual* revenue directly.
  return rates.find((bracket) => revenue <= bracket.maxRevenue);
}

// Helper to calculate tax breakdown based on revenue and effective rate components
function calculateTaxComponentAmounts(
  revenue: number,
  effectiveRate: number,
  bracket: SimplesNacionalRateBracket,
  isExport: boolean = false
): TaxBreakdown {
  const breakdown: TaxBreakdown = {
    irpj: 0,
    csll: 0,
    cofins: 0,
    pisPasep: 0,
    cpp: 0,
    iss: 0,
    total: 0,
  };

  const totalTax = revenue * effectiveRate;
  breakdown.total = totalTax;

  for (const key in bracket.componentRates) {
    const taxKey = key as keyof TaxBreakdown;
    if (taxKey === "total") continue;

    const componentRate =
      bracket.componentRates[taxKey as keyof typeof bracket.componentRates] ??
      0;
    const taxAmount = totalTax * componentRate;

    // Apply export exemption if applicable
    const isExempt =
      isExport &&
      EXPORT_EXEMPT_TAXES.includes(
        taxKey as keyof typeof bracket.componentRates
      );
    breakdown[taxKey] = isExempt ? 0 : taxAmount;
  }

  // Recalculate total after exemptions
  if (isExport) {
    breakdown.total =
      breakdown.irpj +
      breakdown.csll +
      breakdown.cpp +
      breakdown.cofins +
      breakdown.pisPasep +
      breakdown.iss;
  }

  return breakdown;
}

export function calculatePjTaxes(
  formData: PjTaxFormData
): PjTaxCalculationResults | null {
  const annualRevenue = safeParseFloat(formData.annualRevenue);
  const monthlyProLabore = safeParseFloat(formData.monthlyProLabore);
  const otherMonthlyPayroll = safeParseFloat(formData.otherMonthlyPayroll);
  const exportPercentage =
    Math.max(0, Math.min(100, safeParseFloat(formData.exportPercentage))) / 100;

  if (annualRevenue <= 0) {
    return null;
  }

  // Calculate Fator R
  const totalAnnualPayroll = (monthlyProLabore + otherMonthlyPayroll) * 12;
  const fatorR = annualRevenue > 0 ? totalAnnualPayroll / annualRevenue : 0;
  const isFatorRMet = fatorR >= 0.28;

  // Determine Applicable Anexo
  let applicableRates: SimplesNacionalRateBracket[];
  let applicableAnexo: "III" | "V";

  if (formData.activityType === "NATURAL_ANEXO_III") {
    applicableRates = ANEXO_III_RATES;
    applicableAnexo = "III";
  } else {
    // SOFTWARE_FACTOR_R
    if (isFatorRMet) {
      applicableRates = ANEXO_III_RATES;
      applicableAnexo = "III";
    } else {
      applicableRates = ANEXO_V_RATES;
      applicableAnexo = "V";
    }
  }

  // Find Rate Bracket and Calculate Effective Rate
  const bracket = findBracket(annualRevenue, applicableRates);
  if (!bracket) {
    // Handle cases above the highest bracket if necessary, maybe return error or cap
    console.error("Revenue exceeds maximum bracket defined.");
    return null; // Or handle appropriately
  }

  const effectiveRate =
    (annualRevenue * bracket.nominalRate - bracket.deduction) / annualRevenue;

  // Calculate Simples Nacional Taxes (Domestic vs. Export)
  const domesticRevenue = annualRevenue * (1 - exportPercentage);
  const exportRevenue = annualRevenue * exportPercentage;

  const domesticTaxBreakdown = calculateTaxComponentAmounts(
    domesticRevenue,
    effectiveRate,
    bracket,
    false
  );
  const exportTaxBreakdown = calculateTaxComponentAmounts(
    exportRevenue,
    effectiveRate,
    bracket,
    true // Apply exemptions for export
  );

  const totalTaxBreakdown: TaxBreakdown = {
    irpj: domesticTaxBreakdown.irpj + exportTaxBreakdown.irpj,
    csll: domesticTaxBreakdown.csll + exportTaxBreakdown.csll,
    cofins: domesticTaxBreakdown.cofins + exportTaxBreakdown.cofins,
    pisPasep: domesticTaxBreakdown.pisPasep + exportTaxBreakdown.pisPasep,
    cpp: domesticTaxBreakdown.cpp + exportTaxBreakdown.cpp,
    iss: domesticTaxBreakdown.iss + exportTaxBreakdown.iss,
    total: domesticTaxBreakdown.total + exportTaxBreakdown.total,
  };

  const exemptionBreakdown: TaxBreakdown = {
    irpj: 0,
    csll: 0,
    cofins:
      calculateTaxComponentAmounts(exportRevenue, effectiveRate, bracket, false)
        .cofins - exportTaxBreakdown.cofins,
    pisPasep:
      calculateTaxComponentAmounts(exportRevenue, effectiveRate, bracket, false)
        .pisPasep - exportTaxBreakdown.pisPasep,
    cpp: 0,
    iss:
      calculateTaxComponentAmounts(exportRevenue, effectiveRate, bracket, false)
        .iss - exportTaxBreakdown.iss,
    total: 0, // Filled below
  };
  exemptionBreakdown.total =
    exemptionBreakdown.cofins +
    exemptionBreakdown.pisPasep +
    exemptionBreakdown.iss;

  const simpleNacionalTotal = totalTaxBreakdown.total;

  // Calculate Pro-Labore Taxes (INSS & IRPF)
  // Use the functions from salary-calculations, applying them monthly and summing annually
  // Note: calculateINSS/IRRF expect monthly salary
  const monthlyINSS = calculateINSS(monthlyProLabore);
  // IRRF base is Pro-Labore minus INSS deduction.
  // We assume no other deductions like dependents for simplicity here.
  const baseIRRF = monthlyProLabore - monthlyINSS;
  const monthlyIRPF = calculateIRRF(baseIRRF);

  const annualINSS = monthlyINSS * 12;
  const annualIRPF = monthlyIRPF * 12;
  const proLaboreTotalTaxes = annualINSS + annualIRPF;

  // Calculate Totals
  const totalAnnualTax = simpleNacionalTotal + proLaboreTotalTaxes;
  const effectiveTotalRate =
    annualRevenue > 0 ? totalAnnualTax / annualRevenue : 0;

  // Calculate Monthly Breakdown
  const monthlyNetProLabore = monthlyProLabore - monthlyINSS - monthlyIRPF;
  const otherAnnualPayroll = otherMonthlyPayroll * 12;
  // Profit available for distribution = Revenue - Other Payroll Costs - Simples Tax - Gross Pro-labore
  const annualProfitAvailable =
    annualRevenue -
    otherAnnualPayroll -
    simpleNacionalTotal -
    monthlyProLabore * 12;
  const monthlyProfitDistribution = annualProfitAvailable / 12;
  const totalMonthlyNetIncome = monthlyNetProLabore + monthlyProfitDistribution;
  // Can also be calculated as: (annualRevenue - otherAnnualPayroll - totalAnnualTax) / 12
  const totalMonthlyTax = totalAnnualTax / 12;

  return {
    formData,
    annualRevenue,
    monthlyProLabore,
    totalAnnualPayroll,
    fatorR,
    isFatorRMet,
    applicableAnexo,
    simplesNacional: {
      domesticRevenue,
      exportRevenue,
      effectiveRate,
      domesticTax: domesticTaxBreakdown,
      exportTax: exportTaxBreakdown,
      totalTax: totalTaxBreakdown,
      exemptions: exemptionBreakdown,
    },
    proLaboreTaxes: {
      inss: annualINSS,
      irpf: annualIRPF,
      total: proLaboreTotalTaxes,
    },
    totalAnnualTax,
    effectiveTotalRate,
    // Monthly values
    monthlyNetProLabore,
    monthlyProfitDistribution,
    totalMonthlyNetIncome,
    totalMonthlyTax,
  };
}
