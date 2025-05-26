import type { CSSProperties } from "react";

export const colors = {
  textPrimary: "#f8fafc", // slate-50
  textSecondary: "#cbd5e1", // slate-300
  textTertiary: "#94a3b8", // slate-400
  textMuted: "#64748b", // slate-500
  textSubtle: "#475569", // slate-600
  border: "#334155", // slate-700
  backgroundStart: "#1e293b", // slate-800
  backgroundEnd: "#0f172a", // slate-900
  accentGreen: "#10b981", // green-500
  accentSky: "#0ea5e9", // sky-500
  accentRose: "#f43f5e", // rose-500
};

export const baseContainerStyle: CSSProperties = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  background: `linear-gradient(135deg, ${colors.backgroundStart} 0%, ${colors.backgroundEnd} 100%)`,
  color: colors.textPrimary,
  fontFamily: '"Inter", sans-serif',
  padding: "60px",
  border: `2px solid ${colors.border}`,
  borderRadius: "16px",
  position: "relative",
};

export const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  fontSize: "36px",
  color: colors.textTertiary,
  marginBottom: "40px",
};

export const footerStyle: CSSProperties = {
  position: "absolute",
  bottom: "20px",
  right: "30px",
  fontSize: "16px",
  color: colors.textTertiary,
};

export const logoContainerStyle: CSSProperties = {
  position: "absolute",
  top: "30px", // Match vertical padding/header alignment
  right: "50px", // Match horizontal padding
  display: "flex",
};

// Common style for detail/parameter labels (used in both images)
export const detailLabelStyle: CSSProperties = {
  fontSize: "20px",
  color: colors.textMuted,
};

// Common logo component for OG images
export function OGLogo() {
  return (
    <div
      style={{
        position: "absolute",
        top: "30px",
        right: "50px",
        display: "flex",
      }}
    >
      <img
        src="https://www.nagringa.dev/logo-v2-no-bg-compressed-small.png"
        alt="nagringa.dev logo"
        height="128"
        width="128"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

// Common header component
export function OGHeader({ title, emoji }: { title: string; emoji: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        fontSize: "36px",
        color: colors.textTertiary,
        marginBottom: "40px",
      }}
    >
      <span>{emoji}</span>
      <span>{title}</span>
    </div>
  );
}

// Common footer component
export function OGFooter() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "30px",
        fontSize: "16px",
        color: colors.textTertiary,
      }}
    >
      www.nagringa.dev
    </div>
  );
}

// Card component for displaying data
export function OGCard({
  title,
  value,
  subtitle,
  accentColor = colors.textPrimary,
  borderColor = colors.border,
}: {
  title: string;
  value: string;
  subtitle?: string;
  accentColor?: string;
  borderColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: colors.backgroundStart,
        padding: "40px",
        borderRadius: "16px",
        border: `2px solid ${borderColor}`,
        minWidth: "300px",
        gap: "16px",
      }}
    >
      <div style={detailLabelStyle}>{title}</div>
      <div
        style={{
          display: "flex",
          fontSize: "48px",
          fontWeight: "bold",
          color: accentColor,
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div
          style={{
            display: "flex",
            fontSize: "16px",
            color: colors.textMuted,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

// Breakdown item for smaller data points
export function OGBreakdownItem({
  label,
  value,
  isNegative = false,
}: {
  label: string;
  value: string;
  isNegative?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        backgroundColor: colors.backgroundEnd,
        borderRadius: "8px",
        border: `1px solid ${colors.border}`,
      }}
    >
      <span
        style={{
          display: "flex",
          fontSize: "16px",
          color: colors.textSecondary,
        }}
      >
        {label}
      </span>
      <span
        style={{
          display: "flex",
          fontSize: "16px",
          fontWeight: "600",
          color: isNegative ? colors.accentRose : colors.textPrimary,
        }}
      >
        {isNegative ? "-" : ""}
        {value}
      </span>
    </div>
  );
}

// Container for breakdown items
export function OGBreakdownContainer({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "20px",
        backgroundColor: colors.backgroundStart,
        borderRadius: "12px",
        border: `1px solid ${colors.border}`,
        minWidth: "280px",
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            fontSize: "18px",
            fontWeight: "600",
            color: colors.textSecondary,
            marginBottom: "8px",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export function OGContainer({
  children,
  title,
  emoji,
}: {
  children: React.ReactNode;
  title: string;
  emoji: string;
}) {
  return (
    <div style={baseContainerStyle}>
      <OGLogo />
      <OGHeader title={title} emoji={emoji} />
      {children}
      <OGFooter />
    </div>
  );
}
