"use client";

import { motion } from "framer-motion";
import { getLevel, quadrantBucket } from "@/lib/scoring";
import { BB } from "@/lib/constants";
import type { Subdomain } from "@/types/heatmap";

interface QuadrantProps {
  allSDs: Subdomain[];
  onDotClick: (sd: Subdomain) => void;
}

const QUADRANTS = [
  { id: "prioritise" as const, label: "Prioritise Now", sub: "High debt · High strategic value", bg: "linear-gradient(135deg, #FBF3E8 0%, #F5E8D4 100%)", border: "#B45309", labelColor: "#7A3606", col: 2, row: 1 },
  { id: "monitor" as const, label: "Monitor", sub: "High debt · Lower strategic impact", bg: "linear-gradient(135deg, #F9EDED 0%, #F3DADA 100%)", border: "#9B2020", labelColor: "#6B1515", col: 1, row: 1 },
  { id: "sustain" as const, label: "Sustain & Invest", sub: "Low debt · High strategic value", bg: `linear-gradient(135deg, ${BB.blueLight} 0%, #D4E2FC 100%)`, border: BB.blue, labelColor: BB.blue, col: 2, row: 2 },
  { id: "maintain" as const, label: "Maintain", sub: "Low debt · Lower strategic impact", bg: `linear-gradient(135deg, ${BB.bg} 0%, #E5E6EA 100%)`, border: BB.mid, labelColor: BB.muted, col: 1, row: 2 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

export function Quadrant({ allSDs, onDotClick }: QuadrantProps) {
  const grouped: Record<string, Subdomain[]> = { prioritise: [], monitor: [], sustain: [], maintain: [] };
  allSDs.forEach((sd) => grouped[quadrantBucket(sd)].push(sd));

  return (
    <div>
      <h3 className="font-display font-extrabold text-[13px] text-bby-dark mb-0.5">Debt Severity vs Strategic Importance</h3>
      <p className="text-[10px] text-bby-muted mb-3 font-body">High debt = score ≥4 · High strategic = High or Critical · Click any domain to inspect</p>
      <div className="grid gap-0" style={{ gridTemplateColumns: "64px 1fr 1fr", gridTemplateRows: "20px 1fr 1fr 20px" }}>
        <div style={{ gridColumn: "1/2", gridRow: "1/2" }} />
        <div className="text-center text-[9px] font-display font-bold text-bby-muted uppercase tracking-widest" style={{ gridColumn: "2/4", gridRow: "1/2" }}>← Strategic Importance →</div>
        <div className="flex items-center justify-end pr-2" style={{ gridColumn: "1/2", gridRow: "2/4" }}>
          <div className="text-[9px] font-display font-bold text-bby-muted uppercase tracking-widest whitespace-nowrap" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>← Debt Severity →</div>
        </div>
        {QUADRANTS.map((q) => (
          <div key={q.id} className="p-3 min-h-[130px] rounded-sm" style={{ gridColumn: `${q.col + 1}/${q.col + 2}`, gridRow: `${q.row + 1}/${q.row + 2}`, background: q.bg, border: `1px solid ${q.border}20` }}>
            <div className="text-[11px] font-display font-extrabold mb-0.5" style={{ color: q.labelColor }}>{q.label}</div>
            <div className="text-[9px] text-bby-muted mb-2 pb-1.5 font-body" style={{ borderBottom: `1px solid ${q.border}15` }}>{q.sub}</div>
            <motion.div className="flex flex-col gap-1" variants={container} initial="hidden" animate="show">
              {grouped[q.id].length === 0 && <div className="text-[9px] text-[#ccc] italic font-body">No domains</div>}
              {grouped[q.id].map((sd) => {
                const l = getLevel(sd.debt);
                return (
                  <motion.div key={sd.id} variants={item} onClick={() => onDotClick(sd)} className="flex justify-between items-center rounded-md cursor-pointer gap-1.5 px-[7px] py-1 transition-all hover:shadow-sm" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)", border: `1px solid ${l.color}20`, borderLeft: `3px solid ${l.color}` }}>
                    <span className="text-[10px] font-display font-bold text-bby-dark flex-1 leading-tight">{sd.name}</span>
                    <span className="text-[9px] font-display font-bold whitespace-nowrap" style={{ color: l.color }}>{l.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ))}
        <div style={{ gridColumn: "1/2", gridRow: "4/5" }} />
        <div className="text-center text-[9px] font-display font-bold text-bby-muted pt-1" style={{ gridColumn: "2/3", gridRow: "4/5" }}>Low / Medium</div>
        <div className="text-center text-[9px] font-display font-bold text-bby-muted pt-1" style={{ gridColumn: "3/4", gridRow: "4/5" }}>High / Critical</div>
      </div>
    </div>
  );
}
