"use client";

import { motion } from "framer-motion";
import { getLevel, debtCost } from "@/lib/scoring";
import { BB } from "@/lib/constants";
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
      <h3 className="font-extrabold text-[13px] text-bby-dark mb-1">
        Debt Interest Cost Waterfall
      </h3>
      <p className="text-[10px] text-bby-muted mb-2.5">
        Domain debt costs ranked — portfolio total{" "}
        <strong>${total.toFixed(1)}M</strong>
      </p>
      <div className="flex flex-col gap-1">
        {sorted.map((sd, i) => {
          const cost = debtCost(sd);
          const l = getLevel(sd.debt);
          return (
            <div key={sd.id} className="flex items-center gap-2">
              <div className="w-[155px] text-[9px] font-semibold text-bby-dark text-right shrink-0 leading-tight">
                {sd.name}
              </div>
              <div className="flex-1 bg-bby-mid rounded-sm h-[13px] overflow-hidden">
                <motion.div
                  className="h-full rounded-sm"
                  style={{ background: l.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((cost / maxVal) * 100)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
                />
              </div>
              <div
                className="w-10 text-[9px] font-extrabold shrink-0"
                style={{ color: l.color }}
              >
                ${cost.toFixed(1)}M
              </div>
            </div>
          );
        })}
        {/* Total row */}
        <div className="flex items-center gap-2 mt-1 pt-1.5 border-t-2 border-bby-dark">
          <div className="w-[155px] text-[10px] font-extrabold text-bby-dark text-right shrink-0">
            TOTAL
          </div>
          <div className="flex-1 bg-bby-dark rounded-sm h-[13px]" />
          <div className="w-10 text-[10px] font-black text-bby-dark shrink-0">
            ${total.toFixed(1)}M
          </div>
        </div>
      </div>
    </div>
  );
}
