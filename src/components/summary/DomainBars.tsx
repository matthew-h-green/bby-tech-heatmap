"use client";

import { motion } from "framer-motion";
import { getLevel, debtCost } from "@/lib/scoring";
import type { Domain, Subdomain } from "@/types/heatmap";

interface DomainBarsProps {
  domains: Domain[];
  infraSds: Subdomain[];
}

export function DomainBars({ domains, infraSds }: DomainBarsProps) {
  const groups = [
    ...domains.map((d) => ({ label: d.label, icon: d.icon, sds: d.subdomains })),
    { label: "Infrastructure", icon: "⚙️", sds: infraSds },
  ];
  const maxCost = Math.max(...groups.map((g) => g.sds.reduce((s, d) => s + debtCost(d), 0)));

  return (
    <div>
      <h3 className="font-extrabold text-[13px] text-bby-dark mb-1">Debt Cost by Domain</h3>
      <p className="text-[10px] text-bby-muted mb-3">
        Estimated annual debt interest cost per L1 domain
      </p>
      {groups.map((g, i) => {
        const cost = g.sds.reduce((s, d) => s + debtCost(d), 0);
        const spend = g.sds.reduce((s, d) => s + d.itSpend, 0);
        const peak = Math.max(...g.sds.map((d) => d.debt));
        const pl = getLevel(peak);

        return (
          <div key={g.label} className="mb-2.5">
            <div className="flex justify-between mb-0.5">
              <span className="text-[11px] font-bold text-bby-dark">
                {g.icon} {g.label}
              </span>
              <span className="text-[11px] font-extrabold" style={{ color: pl.color }}>
                ${cost.toFixed(1)}M{" "}
                <span className="text-bby-muted font-normal">/ ${spend}M spend</span>
              </span>
            </div>
            <div className="bg-bby-mid rounded-[3px] h-2.5 overflow-hidden">
              <motion.div
                className="h-full rounded-[3px]"
                style={{ background: pl.color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((cost / maxCost) * 100)}%` }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
