import {
  calculateCLT,
  calculatePJ,
} from "@/use-cases/calculator/salary-calculations";

export type CalculatorFormData = {
  grossSalary: string;
  pjGrossSalary: string;
  mealAllowance: string;
  transportAllowance: string;
  healthInsurance: string;
  otherBenefits: string;
  includeFGTS: boolean;
  yearsAtCompany: string;
  accountingFee: string;
  inssContribution: string;
  taxRate: string;
  otherExpenses: string;
  taxableBenefits: string;
  nonTaxableBenefits: string;
  plr: string;
};

export type CLTDeductions = {
  inss: number;
  ir: number;
  transportDeduction: number;
};

export type CLTBenefits = {
  mealAllowance: number;
  transportAllowance: number;
  transportDeduction: number;
  healthInsurance: number;
  otherBenefits: number;
  fgts: number;
  thirteenthSalary: number;
  vacationBonus: number;
  potentialMonthlySeverance: number;
};

export type CLTResults = ReturnType<typeof calculateCLT>;

export type PJDeductions = {
  taxes: number;
  accountingFee: number;
  inssContribution: number;
  otherExpenses: number;
  taxRate: number;
};

export type PJResults = ReturnType<typeof calculatePJ>;

export type CalculationResults = {
  clt: CLTResults;
  pj: PJResults;
};
