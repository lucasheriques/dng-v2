import { CalculatorFormData } from "@/app/calculadora-clt-vs-pj/types";
import { describe, expect, it } from "vitest";
import {
  calculateCLT,
  calculatePJ,
  calculateResults,
  findCLTEquivalentForPJ,
  findPJEquivalentForCLT,
} from "./salary-calculations";

function createFormData(
  overrides: Partial<CalculatorFormData> = {}
): CalculatorFormData {
  return {
    grossSalary: "",
    pjGrossSalary: "",
    mealAllowance: "0",
    transportAllowance: "0",
    healthInsurance: "0",
    otherBenefits: "0",
    includeFGTS: true,
    yearsAtCompany: "0",
    plr: "0",
    taxRate: "0",
    accountingFee: "0",
    inssContribution: "0",
    otherExpenses: "0",
    taxableBenefits: "0",
    nonTaxableBenefits: "0",
    ...overrides,
  };
}

describe("calculateCLT", () => {
  it("should calculate basic CLT salary without benefits", () => {
    const input = {
      grossSalary: 5000,
      includeFGTS: true,
    };

    const result = calculateCLT(input);

    expect(result.grossSalary).toBe(5000);
    expect(result.deductions.inss).toBeCloseTo(509.6);
    expect(result.deductions.ir).toBeCloseTo(347.57);
    expect(result.netSalary).toBeCloseTo(4142.83);
  });

  it("should calculate basic CLT salary without benefits", () => {
    const input = {
      grossSalary: 10000,
      includeFGTS: true,
    };

    const result = calculateCLT(input);

    expect(result.grossSalary).toBe(10000);
    expect(result.deductions.inss).toBeCloseTo(951.63);
    expect(result.deductions.ir).toBeCloseTo(1592.3);
    expect(result.netSalary).toBeCloseTo(7456.07);
  });

  it("should calculate CLT salary with all benefits", () => {
    const input = {
      grossSalary: 5000,
      mealAllowance: 500,
      transportAllowance: 200,
      healthInsurance: 300,
      otherBenefits: 200,
      includeFGTS: true,
      yearsAtCompany: 2,
      plr: 5000,
    };

    const result = calculateCLT(input);

    expect(result.grossSalary).toBe(5000);
    expect(result.detailedBenefits.mealAllowance).toBe(500);
    expect(result.detailedBenefits.transportAllowance).toBe(200);
    expect(result.detailedBenefits.healthInsurance).toBe(300);
    expect(result.detailedBenefits.otherBenefits).toBe(200);
    expect(result.detailedBenefits.plrGross).toBe(5000);
  });
});

describe("calculatePJ", () => {
  it("should calculate basic PJ salary with default values", () => {
    const input = {
      grossSalary: 5000,
    };

    const result = calculatePJ(input);

    expect(result.grossSalary).toBe(5000);
    expect(result.deductions.accountingFee).toBe(189);
    expect(result.deductions.taxRate).toBe(0.1);
    expect(result.netSalary).toBeCloseTo(4155.68); // 5000 - (5000 * 0.1) - 189 - (1412 * 0.11)
  });

  it("should calculate PJ salary with custom tax rate and benefits", () => {
    const input = {
      grossSalary: 5000,
      accountingFee: 200,
      taxRate: 0.15,
      inssContribution: 200,
      otherExpenses: 100,
      taxableBenefits: 500,
      nonTaxableBenefits: 300,
    };

    const result = calculatePJ(input);

    expect(result.grossSalary).toBe(5000);
    expect(result.benefits.taxable).toBe(500);
    expect(result.benefits.nonTaxable).toBe(300);
    expect(result.deductions.taxes).toBe((5000 + 500) * 0.15);
  });
});

describe("findCLTEquivalentForPJ", () => {
  it("should find equivalent CLT salary for given PJ net income", () => {
    const formData = createFormData({
      mealAllowance: "500",
      transportAllowance: "200",
      healthInsurance: "300",
      taxRate: "10",
      accountingFee: "189",
      inssContribution: "155.32",
    });

    const targetNet = 5000;
    const result = findCLTEquivalentForPJ(targetNet, formData);

    const cltResult = calculateCLT({
      grossSalary: result,
      mealAllowance: 500,
      transportAllowance: 200,
      healthInsurance: 300,
    });

    expect(Math.abs(cltResult.total - targetNet)).toBeLessThan(
      targetNet * 0.01
    );
  });
});

describe("findPJEquivalentForCLT", () => {
  it("should find equivalent PJ salary for given CLT net income", () => {
    const formData = createFormData({
      taxRate: "10",
      accountingFee: "189",
      inssContribution: "155.32",
    });

    const targetNet = 5000;
    const result = findPJEquivalentForCLT(targetNet, formData);

    const pjResult = calculatePJ({
      grossSalary: result,
      accountingFee: 189,
      inssContribution: 155.32,
      taxRate: 0.1,
    });

    expect(Math.abs(pjResult.total - targetNet)).toBeLessThan(targetNet * 0.01);
  });
});

describe("calculateResults", () => {
  it("should return null when no salary is provided", () => {
    const formData = createFormData();

    const result = calculateResults(formData);
    expect(result).toBeNull();
  });

  it("should calculate both CLT and PJ results when gross salary is provided", () => {
    const formData = createFormData({
      grossSalary: "5000",
      mealAllowance: "500",
      transportAllowance: "200",
      healthInsurance: "300",
      taxRate: "10",
      accountingFee: "189",
      inssContribution: "155.32",
    });

    const result = calculateResults(formData);

    expect(result).not.toBeNull();
    expect(result?.clt).toBeDefined();
    expect(result?.pj).toBeDefined();
    expect(result?.clt.grossSalary).toBe(5000);
    expect(result?.pj.grossSalary).toBe(5000);
  });
});
