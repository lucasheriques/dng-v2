export interface InvestmentCalculatorData {
  initialDeposit: number;
  monthlyContribution: number;
  period: number;
  periodType: "months" | "years";
  interestRate: number;
}

// Added type for monthly breakdown data
export interface MonthlyBreakdownData {
  month: number;
  cumulativeInvested: number;
  monthlyInterestValue: number;
  monthlyInterestPercent: number;
  endOfMonthTotal: number;
}

export interface ChartData {
  month: number;
  initialDeposit: number;
  contributions: number;
  interest: number;
}
