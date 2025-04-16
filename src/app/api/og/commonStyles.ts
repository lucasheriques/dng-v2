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
  color: colors.textSubtle,
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
