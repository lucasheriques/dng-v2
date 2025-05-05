import {
  CalculationResults,
  CalculatorFormData,
} from "@/app/calculadora-clt-vs-pj/types";

interface SalaryInput {
  grossSalary: number;
  mealAllowance?: number;
  transportAllowance?: number;
  healthInsurance?: number;
  otherBenefits?: number;
  includeFGTS?: boolean;
  yearsAtCompany?: number;
  plr?: number;
  otherCltExpenses?: number;
}

interface PJInput {
  grossSalary: number;
  accountingFee?: number;
  inssContribution?: number;
  taxRate?: number;
  otherExpenses?: number;
  taxableBenefits?: number;
  nonTaxableBenefits?: number;
}

const INSS_RANGES = [
  { max: 1412.0, rate: 0.075 },
  { max: 2666.68, rate: 0.09 },
  { max: 4000.03, rate: 0.12 },
  { max: 7786.02, rate: 0.14 },
];

const IRRF_RANGES = [
  { max: 2259.2, rate: 0, deduction: 0 },
  { max: 2826.65, rate: 0.075, deduction: 169.44 },
  { max: 3751.05, rate: 0.15, deduction: 381.44 },
  { max: 4664.68, rate: 0.225, deduction: 662.77 },
  { max: Infinity, rate: 0.275, deduction: 896.0 },
];

const PLR_IRRF_RANGES = [
  { max: 7640.8, rate: 0, deduction: 0 },
  { max: 9922.28, rate: 0.075, deduction: 573.06 },
  { max: 13167.0, rate: 0.15, deduction: 1317.23 },
  { max: 16380.38, rate: 0.225, deduction: 2304.76 },
  { max: Infinity, rate: 0.275, deduction: 3123.78 },
];

// Re-export these functions so they can be reused
// export { calculateINSS, calculateIRRF } from "./salary-calculations";

export function calculateINSS(salary: number): number {
  let inss = 0;
  let remainingSalary = salary;
  let previousMax = 0;

  for (const range of INSS_RANGES) {
    if (salary > previousMax) {
      const taxableAmount = Math.min(range.max - previousMax, remainingSalary);
      inss += taxableAmount * range.rate;
      remainingSalary -= taxableAmount;
    }
    previousMax = range.max;
  }

  return inss;
}

export function calculateIRRF(baseIR: number): number {
  const irRange = IRRF_RANGES.find((range) => baseIR <= range.max);
  return irRange ? baseIR * irRange.rate - irRange.deduction : 0;
}

function calculatePLRTax(plrAmount: number): number {
  const range = PLR_IRRF_RANGES.find((range) => plrAmount <= range.max);
  return range ? plrAmount * range.rate - range.deduction : 0;
}

export function calculateCLT(input: SalaryInput) {
  const {
    grossSalary,
    includeFGTS = true,
    yearsAtCompany = 0,
    otherCltExpenses = 0,
  } = input;

  // Calculate INSS and IR for base salary
  const baseINSS = calculateINSS(grossSalary);
  const baseIR = calculateIRRF(grossSalary - baseINSS);

  // Calculate transport deduction if applicable
  const transportDeduction = input.transportAllowance
    ? Math.min(grossSalary * 0.06, input.transportAllowance)
    : 0;

  // Calculate net base salary
  const netSalary =
    grossSalary - baseINSS - baseIR - transportDeduction - otherCltExpenses;

  // Calculate FGTS including potential severance
  const monthlyFGTS = grossSalary * 0.08;
  const fgtsThirteenth = (grossSalary / 12) * 0.08;
  const fgtsVacation = (grossSalary / 3 / 12) * 0.08;
  const totalMonthlyFGTS = monthlyFGTS + fgtsThirteenth + fgtsVacation;

  const netThirteenth = netSalary / 12;
  const netVacation = netSalary / 3 / 12; // Includes the 1/3 bonus

  // Calculate total FGTS accumulated
  const totalAccumulatedFGTS = totalMonthlyFGTS * 12 * yearsAtCompany;

  // Calculate potential severance (40% of FGTS)
  const potentialSeverance = totalAccumulatedFGTS * 0.4;

  // Amortize severance over 12 months for monthly comparison
  const monthlySeveranceValue = potentialSeverance / 12;

  // Calculate PLR after tax if provided
  const plrTax = input.plr ? calculatePLRTax(input.plr) : 0;
  const netPlr = input.plr ? input.plr - plrTax : 0;
  const monthlyPlr = netPlr / 12; // Distribute PLR over 12 months for comparison

  const benefits =
    (input.mealAllowance || 0) +
    (input.transportAllowance || 0) +
    (input.healthInsurance || 0) +
    (input.otherBenefits || 0) +
    (includeFGTS ? totalMonthlyFGTS : 0) +
    monthlyPlr;

  return {
    grossSalary,
    netSalary,
    deductions: {
      inss: baseINSS,
      ir: baseIR,
      transportDeduction,
      plrTax,
      otherCltExpenses: input.otherCltExpenses || 0,
    },
    benefits,
    detailedBenefits: {
      mealAllowance: input.mealAllowance || 0,
      transportAllowance: input.transportAllowance || 0,
      transportDeduction,
      healthInsurance: input.healthInsurance || 0,
      otherBenefits: input.otherBenefits || 0,
      fgts: totalMonthlyFGTS,
      thirteenthSalary: netThirteenth,
      vacationBonus: netVacation,
      severance: potentialSeverance,
      potentialMonthlySeverance: monthlySeveranceValue,
      plrGross: input.plr || 0,
      plrNet: netPlr,
    },
    total: netSalary + benefits + netThirteenth + netVacation,
    includeFGTS: includeFGTS,
  };
}

export function calculatePJ(input: PJInput) {
  const {
    grossSalary,
    accountingFee = 189,
    taxRate = 0.1,
    otherExpenses = 0,
    taxableBenefits = 0,
    nonTaxableBenefits = 0,
  } = input;

  const MINIMUM_WAGE = 1412;
  const INSS_RATE = 0.11;

  const inssContribution = input.inssContribution ?? MINIMUM_WAGE * INSS_RATE;

  // Add taxable benefits to gross salary for tax calculation
  const taxableAmount = grossSalary + taxableBenefits;
  const taxes = taxableAmount * taxRate;

  const netSalary =
    taxableAmount - taxes - accountingFee - inssContribution - otherExpenses;

  return {
    netSalary,
    grossSalary,
    deductions: {
      taxes,
      accountingFee,
      inssContribution,
      otherExpenses,
      taxRate,
    },
    benefits: {
      taxable: taxableBenefits,
      nonTaxable: nonTaxableBenefits,
    },
    total: netSalary + nonTaxableBenefits,
  };
}

export function findCLTEquivalentForPJ(
  targetNet: number,
  formData: CalculatorFormData
): number {
  let grossSalary = targetNet * 0.8; // Initial guess
  let lastGross = 0;
  const ERROR_MARGIN = 0.0001; // 0.01%

  // Iterate until we find a very close match
  for (let i = 0; i < 10; i++) {
    const result = calculateCLT({
      grossSalary,
      includeFGTS: formData.includeFGTS,
      mealAllowance: Number(formData.mealAllowance) || undefined,
      transportAllowance: Number(formData.transportAllowance) || undefined,
      healthInsurance: Number(formData.healthInsurance) || undefined,
      otherBenefits: Number(formData.otherBenefits) || undefined,
    });

    if (Math.abs(result.total - targetNet) < targetNet * ERROR_MARGIN) {
      return grossSalary;
    }

    const adjustment = (targetNet - result.total) * 0.8;
    lastGross = grossSalary;
    grossSalary += adjustment;

    if (Math.abs(lastGross - grossSalary) < 0.01) {
      break;
    }
  }

  return grossSalary;
}

export function findPJEquivalentForCLT(
  targetNet: number,
  formData: CalculatorFormData
): number {
  // For PJ: netSalary = grossSalary * (1 - taxRate) - fixedCosts
  const taxRate = Number(formData.taxRate) / 100;
  const accountingFee = Number(formData.accountingFee);
  const inssContribution = Number(formData.inssContribution);
  const otherExpenses = Number(formData.otherExpenses) || 0;
  const fixedCosts = accountingFee + inssContribution + otherExpenses;

  return (targetNet + fixedCosts) / (1 - taxRate);
}

export function calculateResults(
  formData: CalculatorFormData
): CalculationResults | null {
  if (!formData.grossSalary && !formData.pjGrossSalary) {
    return null;
  }

  const cltInput = {
    grossSalary: Number(formData.grossSalary || formData.pjGrossSalary),
    mealAllowance: Number(formData.mealAllowance) || undefined,
    transportAllowance: Number(formData.transportAllowance) || undefined,
    healthInsurance: Number(formData.healthInsurance) || undefined,
    otherBenefits: Number(formData.otherBenefits) || undefined,
    includeFGTS: formData.includeFGTS,
    yearsAtCompany: Number(formData.yearsAtCompany) || 0,
    plr: Number(formData.plr) || undefined,
    otherCltExpenses: Number(formData.otherCltExpenses) || 0,
  };

  const pjInput = {
    grossSalary: Number(formData.pjGrossSalary || formData.grossSalary),
    accountingFee: Number(formData.accountingFee),
    inssContribution: Number(formData.inssContribution),
    taxRate: Number(formData.taxRate) / 100,
    otherExpenses: Number(formData.otherExpenses) || 0,
    taxableBenefits: Number(formData.taxableBenefits) || 0,
    nonTaxableBenefits: Number(formData.nonTaxableBenefits) || 0,
  };

  const cltResults = calculateCLT(cltInput);
  const pjResults = calculatePJ(pjInput);

  return { clt: cltResults, pj: pjResults };
}

interface EmployerCostOptions {
  riskLevel?: "low" | "medium" | "high"; // For RAT calculation
  industryType?:
    | "technology"
    | "manufacturing"
    | "commerce"
    | "services"
    | "other"; // For System S
  healthInsurance?: number; // Optional employer-provided health insurance
  otherBenefits?: number; // Any other benefits provided by employer
}

// This function will take the output of calculateCLT and additional options
export function calculateEmployerCost(
  cltResult: ReturnType<typeof calculateCLT>,
  options: EmployerCostOptions = {}
) {
  const {
    riskLevel = "low",
    industryType = "technology",
    healthInsurance = 0,
    otherBenefits = 0,
  } = options;

  const { grossSalary } = cltResult;

  // INSS (Social Security) - mandatory 20% employer contribution
  const inssRate = 0.2;
  const inssContribution = grossSalary * inssRate;

  // FGTS (Guarantee Fund) - already calculated in cltResult but from employee perspective
  // Here we're calculating it as an employer cost
  const fgtsRate = 0.08;
  const fgtsContribution = grossSalary * fgtsRate;

  // RAT (Work Accident Insurance) - varies by industry risk level
  let ratRate: number;
  switch (riskLevel) {
    case "low":
      ratRate = 0.01; // Most tech companies
      break;
    case "medium":
      ratRate = 0.02; // Some tech hardware companies
      break;
    case "high":
      ratRate = 0.03; // Manufacturing, high-risk industries
      break;
    default:
      ratRate = 0.01;
  }
  const ratContribution = grossSalary * ratRate;

  // System S Contribution (varies by industry)
  let systemSRate: number;
  switch (industryType) {
    case "technology":
      systemSRate = 0.058; // Tech industry rate (SESI/SENAI focused)
      break;
    case "commerce":
      systemSRate = 0.055; // Commercial establishments (SESC/SENAC)
      break;
    case "manufacturing":
      systemSRate = 0.06; // Manufacturing industries
      break;
    case "services":
      systemSRate = 0.055; // Service providers
      break;
    default:
      systemSRate = 0.058;
  }
  const systemSContribution = grossSalary * systemSRate;

  // 13th salary (Christmas bonus) - already calculated in cltResults but as benefit
  // Here we calculate it as an employer cost
  const thirteenthSalary = grossSalary;

  // Additional social charges on 13th salary
  const thirteenthInss = thirteenthSalary * inssRate;
  const thirteenthFgts = thirteenthSalary * fgtsRate;
  const thirteenthRat = thirteenthSalary * ratRate;
  const thirteenthSystemS = thirteenthSalary * systemSRate;

  // Vacation (base salary + 1/3 bonus)
  const vacationSalary = grossSalary;
  const vacationBonus = grossSalary / 3; // 1/3 additional

  // Additional social charges on vacation
  const vacationInss = (vacationSalary + vacationBonus) * inssRate;
  const vacationFgts = (vacationSalary + vacationBonus) * fgtsRate;
  const vacationRat = (vacationSalary + vacationBonus) * ratRate;
  const vacationSystemS = (vacationSalary + vacationBonus) * systemSRate;

  // Extract benefits from cltResult that represent employer costs
  const mealAllowance = cltResult.detailedBenefits?.mealAllowance || 0;
  const transportAllowance =
    cltResult.detailedBenefits?.transportAllowance || 0;

  // Amortize annual costs into monthly values
  const monthlyThirteenthSalary = thirteenthSalary / 12;
  const monthlyThirteenthCharges =
    (thirteenthInss + thirteenthFgts + thirteenthRat + thirteenthSystemS) / 12;

  const monthlyVacationSalary = vacationSalary / 12;
  const monthlyVacationBonus = vacationBonus / 12;
  const monthlyVacationCharges =
    (vacationInss + vacationFgts + vacationRat + vacationSystemS) / 12;

  // Basic monthly mandatory costs (salary + direct charges)
  const basicMonthlyCost =
    grossSalary +
    inssContribution +
    fgtsContribution +
    ratContribution +
    systemSContribution;

  // Add prorated 13th and vacation costs
  const totalMonthlyMandatoryCost =
    basicMonthlyCost +
    monthlyThirteenthSalary +
    monthlyThirteenthCharges +
    monthlyVacationSalary +
    monthlyVacationBonus +
    monthlyVacationCharges;

  // Add benefits to get total cost
  const totalBenefits =
    mealAllowance + transportAllowance + healthInsurance + otherBenefits;
  const totalMonthlyCost = totalMonthlyMandatoryCost + totalBenefits;

  // Calculate percentages for easier understanding
  const mandatoryAdditionPercentage =
    (totalMonthlyMandatoryCost / grossSalary - 1) * 100;
  const totalAdditionPercentage = (totalMonthlyCost / grossSalary - 1) * 100;

  return {
    grossSalary,
    mandatoryContributions: {
      inss: inssContribution,
      fgts: fgtsContribution,
      rat: ratContribution,
      systemS: systemSContribution,
      monthlyThirteenthSalary,
      monthlyThirteenthCharges,
      monthlyVacationSalary,
      monthlyVacationBonus,
      monthlyVacationCharges,
    },
    benefits: {
      transportAllowance,
      mealAllowance,
      healthInsurance,
      otherBenefits,
      total: totalBenefits,
    },
    monthlyCosts: {
      basic: basicMonthlyCost,
      mandatory: totalMonthlyMandatoryCost,
      total: totalMonthlyCost,
    },
    percentages: {
      mandatoryAdditionPercentage: mandatoryAdditionPercentage.toFixed(2) + "%",
      totalAdditionPercentage: totalAdditionPercentage.toFixed(2) + "%",
    },
  };
}
