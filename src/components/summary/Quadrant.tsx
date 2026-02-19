"use client";

import { motion } from "framer-motion";
import { getLevel, quadrantBucket } from "@/lib/scoring";
import { Badge } from "@/components/ui/badge";
import type { Subdomain } from "@/types/heatmap";

interface QuadrantProps {
  allSDs: Subdomain[];
  onDotClick: (sd: Subdomain) => void;
}

const QUADRANTS = [
  { id: "prioritise" as const, label: "Prioritise Now", sub: "High debt · High strategic value", bg: "#FFF7ED", border: "#EA580C", labelColor: "#C2410C", col: 2, row: 1 },
  { id: "monitor" as const, label: "Monitor", sub: "High debt · Lower strategic impact", bg: "#FEF2F2", border: "#DC2626", labelColor: "#B91C1C", col: 1, row: 1 },
  { id: "sustain" as const, label: "Sustain & Invest", sub: "Low debt · High strategic value", bg: "#E8EFFE", border: "#0045BE", labelColor: "#0045BE", col: 2, row: 2 },
  { id: "maintain" as const, label: "Maintain", sub: "Low debt · Lower strategic impact", bg: "#F1F5F9", border: "#94A3B8", labelColor: "#64748B", col: 1, row: 2 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

export function Quadrant({ allSDs, onDotClick }: QuadrantProps) {
  const grouped: Record<string, Subdomain[]> = { prioritise: [], monitor: [], sustain: [], maintain: [] };
  allSDs.forEach((sd) => grouped[quadrantBucket(sd)].push(sd));

  return (
    <div>
      <h3 className="font-display font-semibold text-lg text-bby-dark mb-1">Debt Severity vs Strategic Importance</h3>
      <p className="text-sm text-muted-foreground mb-4 font-body">High debt = score ≥4 · High strategic = High or Critical · Click any domain to inspect</p>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: "72px 1fr 1fr", gridTemplateRows: "24px 1fr 1fr 24px" }}>
        <div style={{ gridColumn: "1/2", gridRow: "1/2" }} />
        <div className="text-center text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide flex items-center justify-center" style={{ gridColumn: "2/4", gridRow: "1/2" }}>
          ← Strategic Importance →
        </div>
        <div className="flex items-center justify-end pr-2" style={{ gridColumn: "1/2", gridRow: "2/4" }}>
          <div className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            ← Debt Severity →
          </div>
        </div>
        {QUADRANTS.map((q) => (
          <div
            key={q.id}
            className="p-4 min-h-[150px] rounded-lg"
            style={{
              gridColumn: `${q.col + 1}/${q.col + 2}`,
              gridRow: `${q.row + 1}/${q.row + 2}`,
              background: q.bg,
              border: `1px solid ${q.border}20`,
            }}
          >
            <div className="text-base font-display font-semibold mb-0.5" style={{ color: q.labelColor }}>{q.label}</div>
            <div className="text-xs text-muted-foreground mb-3 pb-2 font-body" style={{ borderBottom: `1px solid ${q.border}15` }}>{q.sub}</div>
            <motion.div className="flex flex-col gap-1.5" variants={container} initial="hidden" animate="show">
              {grouped[q.id].length === 0 && <div className="text-xs text-muted-foreground italic font-body">No domains</div>}
              {grouped[q.id].map((sd) => {
                const l = getLevel(sd.debt);
                return (
                  <motion.div
                    key={sd.id}
                    variants={item}
                    onClick={() => onDotClick(sd)}
                    className="flex justify-between items-center rounded-md cursor-pointer gap-2 px-2.5 py-1.5 transition-shadow hover:shadow-sm bg-white border-l-4"
                    style={{ borderLeftColor: l.color, border: `1px solid ${l.color}15`, borderLeft: `4px solid ${l.color}` }}
                  >
                    <span className="text-sm font-display font-medium text-bby-dark flex-1 leading-tight">{sd.name}</span>
                    <Badge
                      variant="outline"
                      className="text-xs font-medium shrink-0"
                      style={{ backgroundColor: l.bg, color: l.color, borderColor: `${l.color}40` }}
                    >
                      {l.label}
                    </Badge>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ))}
        <div style={{ gridColumn: "1/2", gridRow: "4/5" }} />
        <div className="text-center text-xs font-display font-semibold text-muted-foreground pt-1" style={{ gridColumn: "2/3", gridRow: "4/5" }}>Low / Medium</div>
        <div className="text-center text-xs font-display font-semibold text-muted-foreground pt-1" style={{ gridColumn: "3/4", gridRow: "4/5" }}>High / Critical</div>
      </div>
    </div>
  );
}
