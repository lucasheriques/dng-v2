import { calculateInvestmentResults } from "@/app/calculadora-juros-compostos/investment-calculator"; // Adjust path if moved
import { describe, expect, it } from "vitest";

describe("calculateInvestmentResults", () => {
  it("should calculate correctly with initial deposit and monthly contributions over years", () => {
    const result = calculateInvestmentResults({
      initialDeposit: 10000,
      monthlyContribution: 500,
      period: 10, // years
      periodType: "anos",
      interestRate: 5, // 5%
    });

    // Expected values recalculated based on new logic (contribution before interest)
    expect(result.finalAmount).toBeCloseTo(94111.23);
    expect(result.totalContributions).toBeCloseTo(60000, 2); // 500 * 120
    expect(result.totalInterest).toBeCloseTo(24111.23, 2); // 94111.23 - 10000 - 60000
    expect(result.initialDeposit).toBe(10000);
  });

  it("should calculate correctly with initial deposit and monthly contributions over months", () => {
    const result = calculateInvestmentResults({
      initialDeposit: 5000,
      monthlyContribution: 200,
      period: 24, // months
      periodType: "meses",
      interestRate: 6, // 6%
    });

    // Expected values recalculated based on new logic
    expect(result.finalAmount).toBeCloseTo(10722.19, 2);
    expect(result.totalContributions).toBeCloseTo(4800, 2); // 200 * 24
    expect(result.totalInterest).toBeCloseTo(922.19, 2); // 10722.19 - 5000 - 4800
    expect(result.initialDeposit).toBe(5000);
  });

  it("should calculate correctly with zero initial deposit", () => {
    const result = calculateInvestmentResults({
      initialDeposit: 0,
      monthlyContribution: 1000,
      period: 5, // years
      periodType: "anos",
      interestRate: 7,
    });

    // Expected values recalculated based on new logic
    expect(result.finalAmount).toBeCloseTo(71592.9, 2);
    expect(result.totalContributions).toBeCloseTo(60000, 2); // 1000 * 12 * 5
    expect(result.totalInterest).toBeCloseTo(11592.9, 2);
    expect(result.initialDeposit).toBe(0);
  });

  it("should calculate correctly with zero monthly contributions", () => {
    const result = calculateInvestmentResults({
      initialDeposit: 20000,
      monthlyContribution: 0,
      period: 15, // years
      periodType: "anos",
      interestRate: 4,
    });

    // Expected values recalculated based on new logic
    expect(result.finalAmount).toBeCloseTo(36406.03, 2);
    expect(result.totalContributions).toBe(0);
    expect(result.totalInterest).toBeCloseTo(16406.03, 2);
    expect(result.initialDeposit).toBe(20000);
  });

  it("should calculate correctly with zero interest rate", () => {
    const result = calculateInvestmentResults({
      initialDeposit: 10000,
      monthlyContribution: 500,
      period: 10, // years
      periodType: "anos",
      interestRate: 0,
    });

    expect(result.finalAmount).toBe(70000); // 10000 + (500 * 12 * 10)
    expect(result.totalContributions).toBe(60000);
    expect(result.totalInterest).toBe(0);
    expect(result.initialDeposit).toBe(10000);
  });

  it("should calculate percentages correctly", () => {
    const result = calculateInvestmentResults({
      initialDeposit: 10000,
      monthlyContribution: 1000,
      period: 10,
      periodType: "anos",
      interestRate: 5.5,
    });

    const finalAmount = result.finalAmount;
    expect(result.initialDepositPercent).toBeCloseTo(
      (10000 / finalAmount) * 100,
      1
    );
    expect(result.contributionsPercent).toBeCloseTo(
      (result.totalContributions / finalAmount) * 100,
      1
    );
    expect(result.interestPercent).toBeCloseTo(
      (result.totalInterest / finalAmount) * 100,
      1
    );
    expect(
      result.initialDepositPercent +
        result.contributionsPercent +
        result.interestPercent
    ).toBeCloseTo(100, 1);
  });

  it("should handle zero final amount for percentages", () => {
    const result = calculateInvestmentResults({
      initialDeposit: 0,
      monthlyContribution: 0,
      period: 0,
      periodType: "anos",
      interestRate: 5,
    });

    expect(result.finalAmount).toBe(0);
    expect(result.initialDepositPercent).toBe(0);
    expect(result.contributionsPercent).toBe(0);
    expect(result.interestPercent).toBe(0);
  });
});
