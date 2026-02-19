"use client";

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
  },
  {
    key: "cost" as const,
    label: "Est. Annual Debt Cost",
    tooltip: "Estimated annual cost attributable to tech debt (spend × debt interest %)",
    color: "#9B2020",
  },
  {
    key: "avg" as const,
    label: "Avg Portfolio Debt Score",
    tooltip: "Mean debt score across all subdomains (1 = Minimal, 5 = Very High)",
    color: "#B45309",
  },
  {
    key: "high" as const,
    label: "High / Very High Domains",
    tooltip: "Number of subdomains scored 4 (High) or 5 (Very High) tech debt",
    color: BB.dark,
  },
];

export function KPIBar() {
  const { totalSpend, totalDebtCost, avgDebtScore, highCount, allSubdomains } = useHeatmap();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3.5">
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
              <div
                className="bg-white rounded-lg px-3.5 py-3 border border-bby-mid cursor-default transition-shadow hover:shadow-md"
                style={{ borderTopWidth: 3, borderTopColor: kpi.color }}
              >
                <div className="text-[9px] text-bby-muted font-bold uppercase tracking-wider">
                  {kpi.label}
                </div>
                <AnimatedNumber
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                  decimals={decimals}
                  className="text-xl font-black mt-1.5 block"
                  style={{ color: kpi.color }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs max-w-[200px]">{kpi.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
