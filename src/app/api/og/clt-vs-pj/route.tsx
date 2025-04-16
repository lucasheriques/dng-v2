import { CalculatorFormData } from "@/app/calculadora-clt-vs-pj/types";
import { formatCurrency } from "@/lib/utils";
import { calculateResults } from "@/use-cases/calculator/salary-calculations";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Default values matching the calculator component
const defaultFormData: CalculatorFormData = {
  grossSalary: "",
  pjGrossSalary: "",
  mealAllowance: "",
  transportAllowance: "",
  healthInsurance: "",
  otherBenefits: "",
  includeFGTS: true,
  yearsAtCompany: "",
  accountingFee: "189",
  inssContribution: String(1412 * 0.11), // Or fetch dynamically
  taxRate: "10",
  otherExpenses: "",
  taxableBenefits: "",
  nonTaxableBenefits: "",
  plr: "",
};

// Mapping from formData keys to URL short keys (same as in client component)
const paramMap: { [K in keyof CalculatorFormData]?: string } = {
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
};

// Reverse map for easy lookup: short key -> long key
const reverseParamMap: { [key: string]: keyof CalculatorFormData } = {};
for (const key in paramMap) {
  const formKey = key as keyof CalculatorFormData;
  const shortKey = paramMap[formKey];
  if (shortKey) {
    reverseParamMap[shortKey] = formKey;
  }
}

// Helper functions for parsing
const safeParseString = (
  value: string | null | undefined,
  defaultValue: string
): string => {
  return typeof value === "string" ? value : defaultValue;
};

const safeParseBoolean = (
  value: string | null | undefined,
  defaultValue: boolean
): boolean => {
  if (typeof value !== "string") return defaultValue;
  return value === "1" ? true : value === "0" ? false : defaultValue;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse parameters into formData, falling back to defaults
    const formData: CalculatorFormData = { ...defaultFormData };
    for (const shortKey in reverseParamMap) {
      const formKey = reverseParamMap[shortKey];
      const value = searchParams.get(shortKey); // Use .get()

      // Important: Don't skip if value is null/undefined, let defaults handle it
      if (formKey === "includeFGTS") {
        formData[formKey] = safeParseBoolean(value, defaultFormData[formKey]);
      } else {
        // Use default if value is null or empty string (for non-boolean fields)
        formData[formKey] = safeParseString(
          value,
          defaultFormData[formKey] as string
        );
      }
    }

    // Perform calculations
    const results = calculateResults(formData);

    // --- OG Image Generation ---
    const imageWidth = 1200;
    const imageHeight = 630;

    // Check if results are null (shouldn't happen with current logic, but safe)
    if (!results) {
      return new Response("Could not calculate results from provided data.", {
        status: 400,
      });
    }

    // Use the 'total' property which represents the comparable monthly amount
    const netCLT = results.clt.total;
    const netPJ = results.pj.total;
    const difference = netPJ - netCLT;
    const advantage = difference > 0 ? "PJ" : "CLT";
    const advantageColor = difference > 0 ? "#0ea5e9" : "#f43f5e"; // sky-500 for PJ, rose-500 for CLT

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", // slate-800 to slate-900
            color: "#f8fafc", // slate-50
            fontFamily: '"Inter", sans-serif',
            padding: "60px",
            border: "2px solid #334155", // slate-700
            borderRadius: "16px",
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "28px",
              color: "#94a3b8", // slate-400
              marginBottom: "30px", // Reduced margin
            }}
          >
            <span>⚖️</span> {/* Scales emoji */}
            <span>Comparativo CLT vs. PJ</span>
          </div>

          {/* Main Comparison Area */}
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-around", // Space out CLT and PJ sections
              alignItems: "center",
              gap: "40px",
              padding: "20px 0",
              borderTop: "1px solid #334155",
              borderBottom: "1px solid #334155",
              marginBottom: "30px",
            }}
          >
            {/* CLT Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px", // Adjusted gap
              }}
            >
              <span style={{ fontSize: "24px", color: "#cbd5e1" }}>CLT 💼</span>
              {/* Gross Salary */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <span style={{ fontSize: "18px", color: "#94a3b8" }}>
                  Salário Bruto
                </span>
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "normal",
                    color: "#e2e8f0",
                  }}
                >
                  {formatCurrency(
                    parseFloat(formData.grossSalary || "0"),
                    "BRL"
                  )}
                </span>
              </div>
              {/* Total Monthly */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "15px",
                }}
              >
                <span style={{ fontSize: "18px", color: "#94a3b8" }}>
                  Total Mensal
                </span>
                <span
                  style={{
                    fontSize: "56px",
                    fontWeight: "bold",
                    color: "#f8fafc",
                  }}
                >
                  {formatCurrency(netCLT, "BRL")}
                </span>
              </div>
            </div>

            {/* PJ Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px", // Adjusted gap
              }}
            >
              <span style={{ fontSize: "24px", color: "#cbd5e1" }}>PJ 🏢</span>
              {/* Gross Revenue */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <span style={{ fontSize: "18px", color: "#94a3b8" }}>
                  Receita Bruta
                </span>
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "normal",
                    color: "#e2e8f0",
                  }}
                >
                  {formatCurrency(
                    parseFloat(formData.pjGrossSalary || "0"),
                    "BRL"
                  )}
                </span>
              </div>
              {/* Total Monthly */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "15px",
                }}
              >
                <span style={{ fontSize: "18px", color: "#94a3b8" }}>
                  Total Mensal
                </span>
                <span
                  style={{
                    fontSize: "56px",
                    fontWeight: "bold",
                    color: "#f8fafc",
                  }}
                >
                  {formatCurrency(netPJ, "BRL")}
                </span>
              </div>
            </div>
          </div>

          {/* Difference / Advantage */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "auto", // Push to bottom before footer
              gap: "5px",
            }}
          >
            <span style={{ fontSize: "22px", color: "#cbd5e1" }}>
              {`${advantage} é\u00A0`}
              {/* Use non-breaking space */}
              <span style={{ color: advantageColor, fontWeight: "bold" }}>
                {formatCurrency(Math.abs(difference), "BRL")}
              </span>
              {`\u00A0${difference >= 0 ? "maior" : "menor"} por mês`}
              {/* Use non-breaking space */}
            </span>
          </div>

          {/* Signature/Branding */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "30px",
              fontSize: "16px",
              color: "#475569",
            }}
          >
            Calculadora CLT vs PJ - nagringa.dev
          </div>
        </div>
      ),
      {
        width: imageWidth,
        height: imageHeight,
      }
    );
  } catch (e: unknown) {
    let errorMessage = "An unknown error occurred";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error("Failed to generate clt-vs-pj OG image:", errorMessage);
    return new Response(`Failed to generate the image: ${errorMessage}`, {
      status: 500,
    });
  }
}
