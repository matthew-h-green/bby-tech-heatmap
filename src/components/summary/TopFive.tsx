"use client";

import { motion } from "framer-motion";
import { getLevel, dimColor, priorityScore, debtCost } from "@/lib/scoring";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
      <h3 className="font-display font-semibold text-lg text-bby-dark mb-1">Top 5 Priority Domains</h3>
      <p className="text-sm text-muted-foreground mb-3 font-body">
        Ranked by debt x strategic importance x interest rate
      </p>
      <motion.div variants={container} initial="hidden" animate="show">
        {scored.map((sd, i) => {
          const l = getLevel(sd.debt);
          return (
            <motion.div key={sd.id} variants={item}>
              <Card
                onClick={() => onSelect(sd)}
                className="flex items-start gap-3 p-3.5 mb-2.5 cursor-pointer border-l-4 hover:shadow-md transition-shadow py-3.5"
                style={{ borderLeftColor: l.color }}
              >
                <div
                  className="font-display font-bold text-xl w-7 shrink-0 leading-none text-center"
                  style={{ color: l.color, opacity: 0.4 }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-medium text-sm text-bby-dark">{sd.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 mb-2 font-body truncate">{sd.opportunities[0]}</div>
                  <div className="flex gap-2.5 flex-wrap">
                    {DIMS.map((dim) => {
                      const s = sd[dim.key];
                      const c = dimColor(s);
                      return (
                        <div key={dim.key} className="flex items-center gap-1">
                          <span className="text-sm">{dim.icon}</span>
                          <ScoreDots score={s} color={c} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    variant="outline"
                    className="text-xs font-medium"
                    style={{ backgroundColor: l.bg, color: l.color, borderColor: `${l.color}40` }}
                  >
                    {l.label}
                  </Badge>
                  <div className="text-sm font-display font-semibold text-[#DC2626] mt-1.5">
                    ${debtCost(sd).toFixed(1)}M
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
