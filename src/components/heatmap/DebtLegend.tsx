"use client";

import { DEBT_LEVELS, DIMS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function DebtLegend() {
  return (
    <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
      <div className="flex gap-2 items-center flex-wrap">
        <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide">
          Debt Level
        </span>
        {DEBT_LEVELS.map((d) => (
          <Tooltip key={d.score}>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="text-xs font-medium cursor-default"
                style={{
                  backgroundColor: d.bg,
                  color: d.color,
                  borderColor: `${d.color}40`,
                }}
              >
                {d.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Score: {d.score}/5
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide">
          Dimensions
        </span>
        {DIMS.map((d) => (
          <Tooltip key={d.key}>
            <TooltipTrigger asChild>
              <span className="text-xs text-muted-foreground cursor-default font-body">
                {d.icon} {d.label}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-[180px]">
              {d.desc}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
