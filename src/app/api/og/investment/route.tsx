import { calculateInvestmentResults } from "@/app/calculadora-juros-compostos/lib";
import { InvestmentCalculatorData } from "@/app/calculadora-juros-compostos/types";
import { colors, detailLabelStyle, OGContainer } from "@/lib/og-components"; // Corrected import path
import { formatCurrency } from "@/lib/utils";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Default values matching the calculator component
const defaultValues: InvestmentCalculatorData = {
  initialDeposit: 10000,
  monthlyContribution: 1000,
  period: 10,
  periodType: "years",
  interestRate: 5.5,
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse parameters, falling back to defaults
    const initialDeposit = searchParams.has("i")
      ? Number(searchParams.get("i"))
      : defaultValues.initialDeposit;
    const monthlyContribution = searchParams.has("m")
      ? Number(searchParams.get("m"))
      : defaultValues.monthlyContribution;
    const period = searchParams.has("p")
      ? Number(searchParams.get("p"))
      : defaultValues.period;
    const periodType = searchParams.has("pt")
      ? (searchParams.get("pt") ?? defaultValues.periodType)
      : defaultValues.periodType;
    const interestRate = searchParams.has("r")
      ? Number(searchParams.get("r"))
      : defaultValues.interestRate;

    // Validate parsed numbers
    if (
      isNaN(initialDeposit) ||
      isNaN(monthlyContribution) ||
      isNaN(period) ||
      isNaN(interestRate) ||
      (periodType !== "years" && periodType !== "months")
    ) {
      return new Response("Invalid parameters", { status: 400 });
    }

    const calculationParams = {
      initialDeposit,
      monthlyContribution,
      period,
      periodType: periodType as "years" | "months",
      interestRate,
    };

    const results = calculateInvestmentResults(calculationParams);

    const imageWidth = 1200;
    const imageHeight = 630;

    return new ImageResponse(
      (
        <OGContainer title="Simulação de Juros Compostos" emoji="📈">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              fontSize: "30px",
              color: "#94a3b8",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={detailLabelStyle}>Período</span>{" "}
              {/* Use shared style */}
              <span>{`${calculationParams.period} ${
                calculationParams.periodType === "years" ? "anos" : "meses"
              }`}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={detailLabelStyle}>
                {" "}
                {/* Use shared style */}
                Investimento mensal
              </span>
              <span>
                {formatCurrency(calculationParams.monthlyContribution, "BRL")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={detailLabelStyle}>
                {" "}
                {/* Use shared style */}
                Taxa de Juros (Anual)
              </span>
              <span>{calculationParams.interestRate}%</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexGrow: 1,
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "32px", color: "#cbd5e1" }}>
              Seu montante final será:
            </div>
            <div
              style={{
                fontSize: "96px",
                fontWeight: "bold",
                color: "#f8fafc",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {formatCurrency(results.finalAmount, "BRL")}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              marginTop: "40px",
              paddingTop: "20px",
              borderTop: `1px solid ${colors.border}`, // Use shared color
              fontSize: "28px",
              color: colors.textSecondary, // Use shared color
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={detailLabelStyle}>
                {" "}
                {/* Use shared style */}
                Depósito Inicial
              </span>
              <span style={{ fontWeight: 500 }}>
                {formatCurrency(results.initialDeposit, "BRL")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={detailLabelStyle}>
                {" "}
                {/* Use shared style */}
                Contribuições
              </span>
              <span style={{ fontWeight: 500 }}>
                + {formatCurrency(results.totalContributions, "BRL")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={detailLabelStyle}>
                {" "}
                {/* Use shared style */}
                Juros 💰
              </span>
              <span style={{ fontWeight: 500, color: colors.accentGreen }}>
                {" "}
                {/* Use shared color */}+{" "}
                {formatCurrency(results.totalInterest, "BRL")}
              </span>
            </div>
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
    console.error("Failed to generate OG image:", errorMessage);
    return new Response(`Failed to generate the image: ${errorMessage}`, {
      status: 500,
    });
  }
}
