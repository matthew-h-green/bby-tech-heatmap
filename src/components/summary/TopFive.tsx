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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
};

export function TopFive({ allSDs, onSelect }: TopFiveProps) {
  const scored = allSDs
    .map((sd) => ({ ...sd, priority: priorityScore(sd) }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  return (
    <div>
      <h3 className="font-extrabold text-[13px] text-bby-dark mb-1">Top 5 Priority Domains</h3>
      <p className="text-[10px] text-bby-muted mb-2.5">
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
              className="flex items-start gap-2.5 p-2.5 mb-1.5 bg-white rounded-md border border-bby-mid cursor-pointer hover:shadow-md transition-shadow"
              style={{ borderLeft: `4px solid ${l.color}` }}
            >
              <div className="font-black text-lg text-bby-mid w-5 shrink-0 leading-none">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-bold text-[11px] text-bby-dark">{sd.name}</div>
                <div className="text-[9px] text-bby-muted mt-0.5 mb-1.5">
                  {sd.opportunities[0]}
                </div>
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
                  className="rounded px-1.5 py-px text-[9px] font-bold"
                  style={{
                    background: l.bg,
                    color: l.color,
                    border: `1px solid ${l.color}40`,
                  }}
                >
                  {l.label}
                </span>
                <div className="text-[10px] font-extrabold text-[#A63D2F] mt-0.5">
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
