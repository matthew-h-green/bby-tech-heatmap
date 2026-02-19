"use client";

import { useHeatmap } from "@/context/HeatmapContext";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { Card, CardContent } from "@/components/ui/card";
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
    color: "#DC2626",
  },
  {
    key: "avg" as const,
    label: "Avg Portfolio Debt Score",
    tooltip: "Mean debt score across all subdomains (1 = Minimal, 5 = Very High)",
    color: "#D97706",
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
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
              <Card className="cursor-default border-l-4 py-0" style={{ borderLeftColor: kpi.color }}>
                <CardContent className="p-5">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide font-body">
                    {kpi.label}
                  </div>
                  <AnimatedNumber
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={decimals}
                    className="text-2xl font-display font-bold mt-1 block"
                    style={{ color: kpi.color }}
                  />
                </CardContent>
              </Card>
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
