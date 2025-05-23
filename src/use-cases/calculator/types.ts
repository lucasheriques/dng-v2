export type CLTCalculatorFormData = {
  grossSalary: string;
  mealAllowance: string;
  transportAllowance: string;
  healthInsurance: string;
  otherBenefits: string;
  includeFGTS: boolean;
  yearsAtCompany: string;
  plr: string;
  otherCltExpenses: string;
  alimony: string;
  dependentsCount: string;
};

export type PJCalculatorFormData = {
  pjGrossSalary: string;
  accountingFee: string;
  inssContribution: string;
  taxRate: string;
  otherExpenses: string;
  taxableBenefits: string;
  nonTaxableBenefits: string;
};

export type CalculatorFormData = CLTCalculatorFormData & PJCalculatorFormData;
