"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingDown, Gauge, AlertTriangle } from "lucide-react";
import { useHeatmap } from "@/context/HeatmapContext";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BB } from "@/lib/constants";

const kpis = [
  {
    key: "spend" as const,
    label: "Addressable IT Spend",
    tooltip: "Total IT spend across all assessed technology domains",
    color: BB.blue,
    Icon: DollarSign,
  },
  {
    key: "cost" as const,
    label: "Est. Annual Debt Cost",
    tooltip: "Estimated annual cost attributable to tech debt (spend × debt interest %)",
    color: "#9B2020",
    Icon: TrendingDown,
  },
  {
    key: "avg" as const,
    label: "Avg Portfolio Debt Score",
    tooltip: "Mean debt score across all subdomains (1 = Minimal, 5 = Very High)",
    color: "#B45309",
    Icon: Gauge,
  },
  {
    key: "high" as const,
    label: "High / Very High Domains",
    tooltip: "Number of subdomains scored 4 (High) or 5 (Very High) tech debt",
    color: BB.dark,
    Icon: AlertTriangle,
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function KPIBar() {
  const { totalSpend, totalDebtCost, avgDebtScore, highCount, allSubdomains } = useHeatmap();

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {kpis.map((kpi) => {
        let value: number;
        let prefix = "";
        let suffix = "";
        let decimals = 0;

        switch (kpi.key) {
          case "spend":
            value = totalSpend;
            prefix = "$";
            suffix = "M";
            break;
          case "cost":
            value = totalDebtCost;
            prefix = "$";
            suffix = "M";
            decimals = 1;
            break;
          case "avg":
            value = avgDebtScore;
            suffix = " / 5";
            decimals = 1;
            break;
          case "high":
            value = highCount;
            suffix = ` of ${allSubdomains.length}`;
            break;
        }

        return (
          <Tooltip key={kpi.key}>
            <TooltipTrigger asChild>
              <motion.div
                variants={cardVariant}
                className="glass-card glass-card-hover relative rounded-xl px-4 py-3.5 cursor-default overflow-hidden"
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                  style={{
                    background: `linear-gradient(180deg, ${kpi.color} 0%, ${kpi.color}80 100%)`,
                  }}
                />
                {/* Watermark icon */}
                <kpi.Icon
                  size={64}
                  className="absolute -right-2 -bottom-2 opacity-[0.04]"
                  style={{ color: kpi.color }}
                  strokeWidth={1.5}
                />
                {/* Content */}
                <div className="relative">
                  <div className="text-[9px] text-bby-muted font-semibold uppercase tracking-widest font-body">
                    {kpi.label}
                  </div>
                  <AnimatedNumber
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={decimals}
                    className="text-2xl font-display font-extrabold mt-1 block"
                    style={{ color: kpi.color }}
                  />
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs max-w-[200px]">{kpi.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </motion.div>
  );
}
