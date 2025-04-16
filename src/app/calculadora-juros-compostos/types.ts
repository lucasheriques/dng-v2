export interface InvestmentCalculatorData {
  initialDeposit: number;
  monthlyContribution: number;
  period: number;
  periodType: string;
  interestRate: number;
}

export interface ChartData {
  month: number;
  initialDeposit: number;
  contributions: number;
  interest: number;
}
