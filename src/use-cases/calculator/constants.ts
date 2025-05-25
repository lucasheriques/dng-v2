import {
  CalculatorFormData,
  CLTCalculatorFormData,
  PJCalculatorFormData,
} from "@/use-cases/calculator/types";

const MIN_WAGE = 1518;

export const DEFAULT_CLT_FORM_DATA: CLTCalculatorFormData = {
  grossSalary: "",
  mealAllowance: "",
  transportAllowance: "",
  healthInsurance: "",
  otherBenefits: "",
  includeFGTS: true,
  yearsAtCompany: "",
  plr: "",
  otherCltExpenses: "",
  alimony: "",
  dependentsCount: "0",
};

export const DEFAULT_PJ_FORM_DATA: PJCalculatorFormData = {
  pjGrossSalary: "",
  accountingFee: "189",
  inssContribution: String(MIN_WAGE * 0.11), // Consider making this dynamic based on current min wage
  taxRate: "10",
  otherExpenses: "",
  taxableBenefits: "",
  nonTaxableBenefits: "",
};

export const DEFAULT_FORM_DATA: CalculatorFormData = {
  ...DEFAULT_CLT_FORM_DATA,
  ...DEFAULT_PJ_FORM_DATA,
};

export const CLT_PARAMETERS_MAP: {
  [K in keyof CLTCalculatorFormData]: string;
} = {
  grossSalary: "gs",
  mealAllowance: "ma",
  transportAllowance: "ta",
  healthInsurance: "hi",
  otherBenefits: "ob",
  includeFGTS: "fgts",
  yearsAtCompany: "yc",
  plr: "plr",
  otherCltExpenses: "oce",
  alimony: "pa",
  dependentsCount: "dc",
};

export const PJ_PARAMETERS_MAP: { [K in keyof PJCalculatorFormData]: string } =
  {
    pjGrossSalary: "pjs",
    accountingFee: "af",
    inssContribution: "inss",
    taxRate: "tr",
    otherExpenses: "oe",
    taxableBenefits: "tb",
    nonTaxableBenefits: "nb",
  };

export const PARAMETERS_MAP: { [K in keyof CalculatorFormData]: string } = {
  ...CLT_PARAMETERS_MAP,
  ...PJ_PARAMETERS_MAP,
};

export const REVERSE_CLT_PARAM_MAP: {
  [key: string]: keyof CLTCalculatorFormData;
} = {};

for (const key in CLT_PARAMETERS_MAP) {
  const formKey = key as keyof CLTCalculatorFormData;
  const shortKey = CLT_PARAMETERS_MAP[formKey];
  if (shortKey) {
    REVERSE_CLT_PARAM_MAP[shortKey] = formKey;
  }
}
export const REVERSE_PJ_PARAM_MAP: {
  [key: string]: keyof PJCalculatorFormData;
} = {};

for (const key in PJ_PARAMETERS_MAP) {
  const formKey = key as keyof PJCalculatorFormData;
  const shortKey = PJ_PARAMETERS_MAP[formKey];
  if (shortKey) {
    REVERSE_PJ_PARAM_MAP[shortKey] = formKey;
  }
}

// Reverse map needed for loading history and parsing params
export const REVERSE_PARAM_MAP: { [key: string]: keyof CalculatorFormData } = {
  ...REVERSE_CLT_PARAM_MAP,
  ...REVERSE_PJ_PARAM_MAP,
};
