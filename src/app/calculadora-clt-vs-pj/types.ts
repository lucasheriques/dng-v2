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
  otherCltExpenses: string;
};

// Moved from calculator.tsx and page.tsx
export const defaultFormData: CalculatorFormData = {
  grossSalary: "",
  pjGrossSalary: "",
  mealAllowance: "",
  transportAllowance: "",
  healthInsurance: "",
  otherBenefits: "",
  includeFGTS: true,
  yearsAtCompany: "",
  accountingFee: "189",
  inssContribution: String(1412 * 0.11), // Consider making this dynamic based on current min wage
  taxRate: "10",
  otherExpenses: "",
  taxableBenefits: "",
  nonTaxableBenefits: "",
  plr: "",
  otherCltExpenses: "",
};

// Mapping from formData keys to URL short keys
export const paramMap: { [K in keyof CalculatorFormData]?: string } = {
  grossSalary: "gs",
  pjGrossSalary: "pjs",
  mealAllowance: "ma",
  transportAllowance: "ta",
  healthInsurance: "hi",
  otherBenefits: "ob",
  includeFGTS: "fgts",
  yearsAtCompany: "yc",
  accountingFee: "af",
  inssContribution: "inss",
  taxRate: "tr",
  otherExpenses: "oe",
  taxableBenefits: "tb",
  nonTaxableBenefits: "nb",
  plr: "plr",
  otherCltExpenses: "oce",
};

// Reverse map needed for loading history and parsing params
export const reverseParamMap: { [key: string]: keyof CalculatorFormData } = {};
for (const key in paramMap) {
  const formKey = key as keyof CalculatorFormData;
  const shortKey = paramMap[formKey];
  if (shortKey) {
    reverseParamMap[shortKey] = formKey;
  }
}

// Helper function to safely parse boolean values from strings ("1"/"0")
export const safeParseBoolean = (
  value: string | string[] | null | undefined,
  defaultValue: boolean
): boolean => {
  if (typeof value !== "string") return defaultValue;
  return value === "1" ? true : value === "0" ? false : defaultValue;
};

// Helper function to safely parse string values intended for numerical calculations
export const safeParseNumberString = (
  value: string | string[] | null | undefined,
  defaultValue: string
): string => {
  const processValue = Array.isArray(value) ? value[0] : value; // Handle potential string[]

  if (typeof processValue !== "string" || processValue.trim() === "") {
    // Allow empty string if default is empty, otherwise use default
    return defaultValue === "" && processValue === "" ? "" : defaultValue;
  }
  // Basic check: try converting to number and see if it's NaN
  // This handles various numeric formats but rejects non-numeric strings.
  // We keep the string format for the state.
  if (isNaN(Number(processValue))) {
    return defaultValue;
  }
  return processValue; // Return the original valid string
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
