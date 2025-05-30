import { colors, detailLabelStyle, OGContainer } from "@/lib/og-components";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_FORM_DATA } from "@/use-cases/calculator/constants";
import { calculateResults } from "@/use-cases/calculator/salary-calculations";
import { CalculatorFormData } from "@/use-cases/calculator/types";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

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
  otherCltExpenses: "oce",
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
    const formData: CalculatorFormData = { ...DEFAULT_FORM_DATA };
    for (const shortKey in reverseParamMap) {
      const formKey = reverseParamMap[shortKey];
      const value = searchParams.get(shortKey); // Use .get()

      // Important: Don't skip if value is null/undefined, let defaults handle it
      if (formKey === "includeFGTS") {
        formData[formKey] = safeParseBoolean(value, DEFAULT_FORM_DATA[formKey]);
      } else {
        // Use default if value is null or empty string (for non-boolean fields)
        formData[formKey] = safeParseString(
          value,
          DEFAULT_FORM_DATA[formKey] as string
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
        <OGContainer title="Comparativo CLT vs. PJ" emoji="⚖️">
          {/* Main Comparison Area */}
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-around", // Space out CLT and PJ sections
              alignItems: "center",
              gap: "40px",
              padding: "20px 0",
              borderBottom: `1px solid ${colors.border}`, // Use shared color
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
              <span style={{ fontSize: "28px", color: colors.textSecondary }}>
                CLT 💼
              </span>{" "}
              {/* Use shared color */}
              {/* Gross Salary */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <span style={detailLabelStyle}>
                  {" "}
                  {/* Use shared style */}
                  Salário Bruto
                </span>
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "normal",
                    color: colors.textSecondary, // Use shared color
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
                <span style={detailLabelStyle}>
                  {" "}
                  {/* Use shared style */}
                  Total Mensal
                </span>
                <span
                  style={{
                    fontSize: "60px",
                    fontWeight: "bold",
                    color: colors.textPrimary, // Use shared color
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
              <span style={{ fontSize: "28px", color: colors.textSecondary }}>
                PJ 🏢
              </span>{" "}
              {/* Use shared color */}
              {/* Gross Revenue */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <span style={detailLabelStyle}>
                  {" "}
                  {/* Use shared style */}
                  Receita Bruta
                </span>
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "normal",
                    color: colors.textSecondary, // Use shared color
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
                <span style={detailLabelStyle}>
                  {" "}
                  {/* Use shared style */}
                  Total Mensal
                </span>
                <span
                  style={{
                    fontSize: "60px",
                    fontWeight: "bold",
                    color: colors.textPrimary, // Use shared color
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
            <span style={{ fontSize: "26px", color: colors.textSecondary }}>
              {" "}
              {/* Use shared color */}
              {`${advantage} é`}&nbsp;
              {/* Use non-breaking space */}
              <span style={{ color: advantageColor, fontWeight: "bold" }}>
                {formatCurrency(Math.abs(difference), "BRL")}
              </span>
              &nbsp;
              {`${difference >= 0 ? "maior" : "menor"} por mês`}
              {/* Use non-breaking space */}
            </span>
          </div>
        </OGContainer>
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
