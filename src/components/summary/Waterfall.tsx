"use client";

import { motion } from "framer-motion";
import { getLevel, debtCost } from "@/lib/scoring";
import type { Subdomain } from "@/types/heatmap";

interface WaterfallProps {
  allSDs: Subdomain[];
}

export function Waterfall({ allSDs }: WaterfallProps) {
  const sorted = allSDs.slice().sort((a, b) => debtCost(b) - debtCost(a));
  const total = sorted.reduce((s, d) => s + debtCost(d), 0);
  const maxVal = debtCost(sorted[0]);

  return (
    <div>
      <h3 className="font-display font-semibold text-lg text-bby-dark mb-1">
        Debt Interest Cost Waterfall
      </h3>
      <p className="text-sm text-muted-foreground mb-4 font-body">
        Domain debt costs ranked — portfolio total{" "}
        <strong className="font-display font-semibold">${total.toFixed(1)}M</strong>
      </p>
      <div className="flex flex-col gap-2">
        {sorted.map((sd, i) => {
          const cost = debtCost(sd);
          const l = getLevel(sd.debt);
          return (
            <div key={sd.id} className="flex items-center gap-3">
              <div className="w-[180px] text-xs font-medium font-body text-bby-dark text-right shrink-0 leading-tight">
                {sd.name}
              </div>
              <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: l.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((cost / maxVal) * 100)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
                />
              </div>
              <div className="w-14 text-xs font-display font-semibold shrink-0" style={{ color: l.color }}>
                ${cost.toFixed(1)}M
              </div>
            </div>
          );
        })}
        {/* Total */}
        <div className="flex items-center gap-3 mt-2 pt-2 border-t-2 border-bby-dark">
          <div className="w-[180px] text-sm font-display font-semibold text-bby-dark text-right shrink-0">
            TOTAL
          </div>
          <div className="flex-1 bg-bby-dark rounded-full h-5" />
          <div className="w-14 text-sm font-display font-bold text-bby-dark shrink-0">
            ${total.toFixed(1)}M
          </div>
        </div>
      </div>
    </div>
  );
}
