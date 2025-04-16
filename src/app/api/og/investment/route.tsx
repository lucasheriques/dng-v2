import { calculateInvestmentResults } from "@/app/calculadora-juros-compostos/lib";
import { InvestmentCalculatorData } from "@/app/calculadora-juros-compostos/types";
import { formatCurrency } from "@/lib/utils";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Default values matching the calculator component
const defaultValues: InvestmentCalculatorData = {
  initialDeposit: 10000,
  monthlyContribution: 1000,
  period: 10,
  periodType: "anos",
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
      (periodType !== "anos" && periodType !== "meses")
    ) {
      return new Response("Invalid parameters", { status: 400 });
    }

    const calculationParams = {
      initialDeposit,
      monthlyContribution,
      period,
      periodType,
      interestRate,
    };

    const results = calculateInvestmentResults(calculationParams);

    const imageWidth = 1200;
    const imageHeight = 630;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            color: "#f8fafc",
            fontFamily: '"Inter", sans-serif',
            padding: "60px",
            border: "2px solid #334155",
            borderRadius: "16px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "28px",
              color: "#94a3b8",
              marginBottom: "40px",
            }}
          >
            <span>📈</span>
            <span>Simulação de Juros Compostos</span>
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
            <div style={{ fontSize: "24px", color: "#cbd5e1" }}>
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
              borderTop: "1px solid #334155",
              fontSize: "20px",
              color: "#cbd5e1",
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
              <span style={{ fontSize: "16px", color: "#64748b" }}>
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
              <span style={{ fontSize: "16px", color: "#64748b" }}>
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
              <span style={{ fontSize: "16px", color: "#64748b" }}>
                Juros 💰
              </span>
              <span style={{ fontWeight: 500, color: "#10b981" }}>
                + {formatCurrency(results.totalInterest, "BRL")}
              </span>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "30px",
              fontSize: "16px",
              color: "#475569",
            }}
          >
            Calculadora de Juros Compostos - nagringa.dev
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
    console.error("Failed to generate OG image:", errorMessage);
    return new Response(`Failed to generate the image: ${errorMessage}`, {
      status: 500,
    });
  }
}
