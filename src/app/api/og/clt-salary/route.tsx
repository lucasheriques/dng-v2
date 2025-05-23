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
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#60a5fa",
              margin: 0,
            }}
          >
            Calculadora Salário Líquido CLT
          </h1>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            gap: "60px",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {/* Input */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#1e293b",
              padding: "40px",
              borderRadius: "16px",
              border: "2px solid #374151",
              minWidth: "300px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                color: "#9ca3af",
                marginBottom: "16px",
              }}
            >
              Salário Bruto
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#f3f4f6",
              }}
            >
              {formatCurrency(Number(grossSalary))}
            </div>
            {dependentsCount > 0 && (
              <div
                style={{
                  fontSize: "16px",
                  color: "#9ca3af",
                  marginTop: "8px",
                }}
              >
                {dependentsCount} dependente{dependentsCount > 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Arrow */}
          <div
            style={{
              fontSize: "48px",
              color: "#60a5fa",
            }}
          >
            →
          </div>

          {/* Result */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#1e293b",
              padding: "40px",
              borderRadius: "16px",
              border: "2px solid #10b981",
              minWidth: "300px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                color: "#9ca3af",
                marginBottom: "16px",
              }}
            >
              Salário Líquido
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#10b981",
              }}
            >
              {formatCurrency(result.total)}
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "#9ca3af",
                marginTop: "8px",
                textAlign: "center",
              }}
            >
              FGTS: {includeFGTS ? "Incluído" : "Não incluído"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "40px",
            fontSize: "18px",
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Dev na Gringa • Cálculo com INSS, IRRF e benefícios
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
