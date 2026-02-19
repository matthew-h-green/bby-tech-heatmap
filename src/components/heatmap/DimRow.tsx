"use client";

import { DIMS } from "@/lib/constants";
import { dimColor, dimColorDark } from "@/lib/scoring";
import { ScoreDots } from "./ScoreDots";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Subdomain } from "@/types/heatmap";

interface DimRowProps {
  sd: Subdomain;
  dark?: boolean;
}

export function DimRow({ sd, dark }: DimRowProps) {
  return (
    <div
      className="grid grid-cols-2 gap-x-2 gap-y-[3px] mt-1.5 pt-1.5"
      style={{ borderTop: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #E8EAED" }}
    >
      {DIMS.map((d) => {
        const s = sd[d.key];
        const c = dark ? dimColorDark(s) : dimColor(s);
        return (
          <Tooltip key={d.key}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-default">
                <span className="text-[9px]">{d.icon}</span>
                <ScoreDots score={s} color={c} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-[200px]">
              <p className="font-semibold">{d.label}: {s}/5</p>
              <p className="text-muted-foreground">{d.desc}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
