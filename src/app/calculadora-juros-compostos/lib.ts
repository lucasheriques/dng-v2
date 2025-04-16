import {
  ChartData,
  InvestmentCalculatorData,
} from "@/app/calculadora-juros-compostos/types";

export const calculateInvestmentResults = ({
  initialDeposit,
  monthlyContribution,
  period,
  periodType,
  interestRate,
}: InvestmentCalculatorData) => {
  const months = periodType === "years" ? period * 12 : period;
  let currentAmount = initialDeposit;
  let totalContributions = 0; // Tracks only monthly contributions
  let totalInterest = 0;
  const chartData: ChartData[] = [];

  // Add initial state (month 0)
  chartData.push({
    month: 0,
    initialDeposit: initialDeposit,
    contributions: 0,
    interest: 0,
  });

  // Calculate month by month from 1 up to 'months'
  for (let i = 1; i <= months; i++) {
    // 1. Calculate interest for the month based on the current amount BEFORE contribution
    const monthlyInterestRate = interestRate / 100 / 12;
    const interestEarned = currentAmount * monthlyInterestRate;
    totalInterest += interestEarned;

    // 2. Update current amount with interest
    currentAmount += interestEarned;

    // 3. Add monthly contribution AFTER calculating interest
    currentAmount += monthlyContribution;
    totalContributions += monthlyContribution;

    // 4. Record data for the chart based on the total number of months
    const shouldRecordMonthly = months <= 36;
    if (shouldRecordMonthly || i % 12 === 0 || i === months) {
      chartData.push({
        month: i,
        initialDeposit: initialDeposit, // Keep initial deposit constant for chart stack
        contributions: totalContributions, // Cumulative monthly contributions
        interest: totalInterest, // Cumulative interest
      });
    }
  }

  // Final amount is the last calculated currentAmount
  const finalAmount = currentAmount;

  // Calculate percentages based on the final amount
  const interestPercent = finalAmount ? (totalInterest / finalAmount) * 100 : 0;
  const contributionsPercent = finalAmount
    ? (totalContributions / finalAmount) * 100 // Percentage of *monthly* contributions
    : 0;
  const initialDepositPercent = finalAmount
    ? (initialDeposit / finalAmount) * 100
    : 0;

  return {
    months,
    totalInterest,
    totalContributions,
    initialDeposit,
    finalAmount,
    chartData,
    // Add percentages to the return object
    interestPercent,
    contributionsPercent,
    initialDepositPercent,
  };
};
