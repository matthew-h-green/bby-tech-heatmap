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
  { label: "Minimal", score: 1, color: "#6B7280", bg: "#F3F4F6" },
  { label: "Low", score: 2, color: "#2563A8", bg: "#EBF2FB" },
  { label: "Moderate", score: 3, color: "#1D6FA0", bg: "#E5F2F8" },
  { label: "High", score: 4, color: "#B45309", bg: "#FBF3E8" },
  { label: "Very High", score: 5, color: "#9B2020", bg: "#F9EDED" },
];

export const DIMS: Dimension[] = [
  { key: "bizValue", label: "Business Value Unlock", icon: "💼", desc: "Opportunity unlocked by resolving debt" },
  { key: "skillsObs", label: "Skills Obsolescence", icon: "📚", desc: "Risk that current skills become hard to hire or retain" },
  { key: "talentConc", label: "Talent Concentration", icon: "👤", desc: "Key person / single point of failure risk" },
  { key: "vendorDep", label: "Vendor Dependency", icon: "🔗", desc: "Lock-in or reliance on non-strategic vendors" },
];

export const STRATEGIC: StrategicLevel[] = ["Low", "Medium", "High", "Critical"];

export const STRAT_COLOR: Record<StrategicLevel, string> = {
  Low: "#9CA3AF",
  Medium: "#4B5563",
  High: "#0045BE",
  Critical: "#1C252C",
};

export const STRAT_RANK: Record<StrategicLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};
