import { colors, detailLabelStyle, OGContainer } from "@/lib/og-components";
import { formatCurrency } from "@/lib/utils";
import { calculateCLT } from "@/use-cases/calculator/salary-calculations";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const grossSalary = searchParams.get("gs") || "5000";
  const includeFGTS = searchParams.get("fgts") === "1";
  const dependentsCount = Number(searchParams.get("dc")) || 0;

  // Calculate the result for display
  const result = calculateCLT({
    grossSalary: Number(grossSalary),
    includeFGTS,
    dependentsCount,
  });

  return new ImageResponse(
    (
      <OGContainer title="Calculadora Salário Líquido CLT" emoji="💰">
        {/* Main Comparison Area */}
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-around",
            alignItems: "center",
            gap: "40px",
            padding: "20px 0",
            borderBottom: `1px solid ${colors.border}`,
            marginBottom: "30px",
          }}
        >
          {/* Gross Salary Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "28px", color: colors.textSecondary }}>
              Salário Bruto 💼
            </span>
            {/* Dependents info */}
            {dependentsCount > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <span style={detailLabelStyle}>
                  {dependentsCount} dependente{dependentsCount > 1 ? "s" : ""}
                </span>
              </div>
            )}
            {/* Gross Amount */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <span
                style={{
                  fontSize: "60px",
                  fontWeight: "bold",
                  color: colors.textPrimary,
                }}
              >
                {formatCurrency(Number(grossSalary), "BRL")}
              </span>
            </div>
          </div>

          {/* Net Salary Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "28px", color: colors.textSecondary }}>
              Salário Líquido 💳
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <span
                style={{
                  fontSize: "60px",
                  fontWeight: "bold",
                  color: colors.textPrimary,
                }}
              >
                {formatCurrency(result.total, "BRL")}
              </span>
            </div>
          </div>
        </div>

        {/* Key Deductions Summary */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "auto",
            gap: "8px",
            fontSize: "26px",
            color: colors.textSecondary,
          }}
        >
          Descontos:
          <span style={{ color: colors.accentRose, fontWeight: "bold" }}>
            INSS {formatCurrency(result.deductions.inss, "BRL")}
          </span>
          {" • "}
          <span style={{ color: colors.accentRose, fontWeight: "bold" }}>
            IR {formatCurrency(result.deductions.ir, "BRL")}
          </span>
        </div>
      </OGContainer>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
