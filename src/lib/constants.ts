import type { DebtLevel, Dimension, StrategicLevel } from "@/types/heatmap";

export const BB = {
  blue: "#0045BE",
  blueLight: "#E8EFFE",
  blueMid: "#C2D4F8",
  yellow: "#FFED31",
  yellowLight: "#FFFBE6",
  dark: "#1C252C",
  white: "#FFFFFF",
  bg: "#F4F5F7",
  mid: "#E8EAED",
  muted: "#6B7280",
} as const;

export const DEBT_LEVELS: DebtLevel[] = [
  { label: "Minimal", score: 1, color: "#64748B", bg: "#F1F5F9" },
  { label: "Low", score: 2, color: "#0D9488", bg: "#F0FDFA" },
  { label: "Moderate", score: 3, color: "#D97706", bg: "#FFFBEB" },
  { label: "High", score: 4, color: "#EA580C", bg: "#FFF7ED" },
  { label: "Very High", score: 5, color: "#DC2626", bg: "#FEF2F2" },
];

export const DIMS: Dimension[] = [
  { key: "bizValue", label: "Business Value Unlock", icon: "💼", desc: "Opportunity unlocked by resolving debt" },
  { key: "skillsObs", label: "Skills Obsolescence", icon: "📚", desc: "Risk that current skills become hard to hire or retain" },
  { key: "talentConc", label: "Talent Concentration", icon: "👤", desc: "Key person / single point of failure risk" },
  { key: "vendorDep", label: "Vendor Dependency", icon: "🔗", desc: "Lock-in or reliance on non-strategic vendors" },
];

export const STRATEGIC: StrategicLevel[] = ["Low", "Medium", "High", "Critical"];

export const STRAT_COLOR: Record<StrategicLevel, string> = {
  Low: "#94A3B8",
  Medium: "#475569",
  High: "#0045BE",
  Critical: "#7C3AED",
};

export const STRAT_RANK: Record<StrategicLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};
