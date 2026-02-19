"use client";

import { DEBT_LEVELS, DIMS } from "@/lib/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function DebtLegend() {
  return (
    <div className="flex justify-between items-center mb-2.5 flex-wrap gap-2">
      <div className="flex gap-1.5 items-center flex-wrap">
        <span className="text-[9px] font-extrabold text-bby-muted uppercase tracking-wider">
          Debt:
        </span>
        {DEBT_LEVELS.map((d) => (
          <Tooltip key={d.score}>
            <TooltipTrigger asChild>
              <span
                className="px-2 py-0.5 rounded text-[9px] font-bold cursor-default"
                style={{
                  background: d.bg,
                  color: d.color,
                  border: `1px solid ${d.color}40`,
                }}
              >
                {d.label}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Score: {d.score}/5
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <span className="text-[9px] font-extrabold text-bby-muted uppercase tracking-wider">
          Dimensions:
        </span>
        {DIMS.map((d) => (
          <Tooltip key={d.key}>
            <TooltipTrigger asChild>
              <span className="text-[9px] text-bby-muted cursor-default">
                {d.icon} {d.label}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-[180px]">
              {d.desc}
            </TooltipContent>
          </Tooltip>
        ))}
        <span className="text-[9px] text-bby-muted ml-1">· dots = score 1-5</span>
      </div>
    </div>
  );
}
