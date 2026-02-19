import { DEBT_LEVELS, STRAT_RANK } from "./constants";
import type { DebtLevel, Subdomain } from "@/types/heatmap";

export function getLevel(score: number): DebtLevel {
  return DEBT_LEVELS.find((d) => d.score === score) || DEBT_LEVELS[0];
}

export function dimColor(score: number): string {
  if (score <= 2) return "#6B7280";
  if (score === 3) return "#2563A8";
  if (score <= 4) return "#B45309";
  return "#9B2020";
}

export function dimColorDark(score: number): string {
  if (score <= 2) return "#86efac";
  if (score === 3) return "#c4b5fd";
  if (score <= 4) return "#fcd34d";
  return "#fca5a5";
}

export function debtOpacity(debt: number): string {
  const opacities = [0.07, 0.12, 0.18, 0.25, 0.33];
  const opacity = opacities[debt - 1] ?? 0.07;
  return Math.round(opacity * 255).toString(16).padStart(2, "0");
}

export function headerOpacity(peak: number): string {
  const opacities = [0.04, 0.07, 0.11, 0.15, 0.2];
  const opacity = opacities[peak - 1] ?? 0.04;
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
