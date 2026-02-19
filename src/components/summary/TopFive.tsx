"use client";

import { motion } from "framer-motion";
import { getLevel, dimColor, priorityScore, debtCost } from "@/lib/scoring";
import { DIMS } from "@/lib/constants";
import { ScoreDots } from "@/components/heatmap/ScoreDots";
import type { Subdomain } from "@/types/heatmap";

interface TopFiveProps {
  allSDs: Subdomain[];
  onSelect: (sd: Subdomain) => void;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } };

export function TopFive({ allSDs, onSelect }: TopFiveProps) {
  const scored = allSDs
    .map((sd) => ({ ...sd, priority: priorityScore(sd) }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  return (
    <div>
      <h3 className="font-display font-extrabold text-[13px] text-bby-dark mb-1">Top 5 Priority Domains</h3>
      <p className="text-[10px] text-bby-muted mb-2.5 font-body">
        Ranked by debt × strategic importance × interest rate
      </p>
      <motion.div variants={container} initial="hidden" animate="show">
        {scored.map((sd, i) => {
          const l = getLevel(sd.debt);
          return (
            <motion.div
              key={sd.id}
              variants={item}
              onClick={() => onSelect(sd)}
              className="flex items-start gap-2.5 p-3 mb-2 rounded-xl cursor-pointer glass-card glass-card-hover"
              style={{ borderLeft: `4px solid ${l.color}` }}
            >
              <div
                className="font-display font-black text-xl w-6 shrink-0 leading-none"
                style={{ color: l.color, opacity: 0.4 }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-[11px] text-bby-dark">{sd.name}</div>
                <div className="text-[9px] text-bby-muted mt-0.5 mb-1.5 font-body">{sd.opportunities[0]}</div>
                <div className="flex gap-2">
                  {DIMS.map((dim) => {
                    const s = sd[dim.key];
                    const c = dimColor(s);
                    return (
                      <div key={dim.key} className="flex items-center gap-[3px]">
                        <span className="text-[9px]">{dim.icon}</span>
                        <ScoreDots score={s} color={c} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span
                  className="rounded-md px-1.5 py-0.5 text-[9px] font-bold font-display"
                  style={{ background: l.bg, color: l.color, border: `1px solid ${l.color}30` }}
                >
                  {l.label}
                </span>
                <div className="text-[10px] font-display font-extrabold text-[#A63D2F] mt-1">
                  ${debtCost(sd).toFixed(1)}M
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
