"use client";

import { DEBT_LEVELS, DIMS } from "@/lib/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function DebtLegend() {
  return (
    <div className="flex justify-between items-center mb-3 flex-wrap gap-2 glass-card rounded-xl px-4 py-2.5">
      <div className="flex gap-1.5 items-center flex-wrap">
        <span className="text-[9px] font-display font-extrabold text-bby-muted uppercase tracking-widest">
          Debt:
        </span>
        {DEBT_LEVELS.map((d) => (
          <Tooltip key={d.score}>
            <TooltipTrigger asChild>
              <span
                className="px-2 py-0.5 rounded-md text-[9px] font-bold font-display cursor-default transition-transform hover:scale-105"
                style={{
                  background: d.bg,
                  color: d.color,
                  border: `1px solid ${d.color}30`,
                }}
              >
                {d.label}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs font-body">
              Score: {d.score}/5
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <span className="text-[9px] font-display font-extrabold text-bby-muted uppercase tracking-widest">
          Dimensions:
        </span>
        {DIMS.map((d) => (
          <Tooltip key={d.key}>
            <TooltipTrigger asChild>
              <span className="text-[9px] text-bby-muted cursor-default font-body">
                {d.icon} {d.label}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-[180px] font-body">
              {d.desc}
            </TooltipContent>
          </Tooltip>
        ))}
        <span className="text-[9px] text-bby-muted ml-1 font-body">· dots = score 1-5</span>
      </div>
    </div>
  );
}
