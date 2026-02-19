import { DEBT_LEVELS, STRAT_RANK } from "./constants";
import type { DebtLevel, Subdomain } from "@/types/heatmap";

export function getLevel(score: number): DebtLevel {
  return DEBT_LEVELS.find((d) => d.score === score) || DEBT_LEVELS[0];
}

export function dimColor(score: number): string {
  if (score <= 2) return "#0D9488";
  if (score === 3) return "#D97706";
  if (score <= 4) return "#EA580C";
  return "#DC2626";
}

export function dimColorDark(score: number): string {
  if (score <= 2) return "#5EEAD4";
  if (score === 3) return "#FCD34D";
  if (score <= 4) return "#FDBA74";
  return "#FCA5A5";
}

export function debtOpacity(debt: number): string {
  const opacities = [0.08, 0.14, 0.20, 0.28, 0.38];
  const opacity = opacities[debt - 1] ?? 0.08;
  return Math.round(opacity * 255).toString(16).padStart(2, "0");
}

export function headerOpacity(peak: number): string {
  const opacities = [0.05, 0.09, 0.14, 0.19, 0.25];
  const opacity = opacities[peak - 1] ?? 0.05;
  return Math.round(opacity * 255).toString(16).padStart(2, "0");
}

export function debtCost(sd: Subdomain): number {
  return sd.itSpend * sd.debtPct / 100;
}

export function priorityScore(sd: Subdomain): number {
  return sd.debt * STRAT_RANK[sd.strategic] * (sd.debtPct / 10);
}

export function quadrantBucket(sd: Subdomain): "prioritise" | "monitor" | "sustain" | "maintain" {
  const highDebt = sd.debt >= 4;
  const highStrat = sd.strategic === "High" || sd.strategic === "Critical";
  if (highDebt && highStrat) return "prioritise";
  if (highDebt && !highStrat) return "monitor";
  if (!highDebt && highStrat) return "sustain";
  return "maintain";
}
