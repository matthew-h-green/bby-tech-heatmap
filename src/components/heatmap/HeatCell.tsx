"use client";

import { motion } from "framer-motion";
import { getLevel, debtOpacity, debtCost } from "@/lib/scoring";
import { DimRow } from "./DimRow";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Subdomain } from "@/types/heatmap";

interface HeatCellProps {
  sd: Subdomain;
  onClick: (sd: Subdomain) => void;
  active: boolean;
}

export function HeatCell({ sd, onClick, active }: HeatCellProps) {
  const l = getLevel(sd.debt);
  const hex = debtOpacity(sd.debt);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          onClick={() => onClick(sd)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="rounded-md px-2.5 py-2 cursor-pointer transition-shadow"
          style={{
            background: active ? l.color : `${l.color}${hex}`,
            border: active ? `2px solid ${l.color}` : `1px solid ${l.color}35`,
            boxShadow: active ? `0 0 0 3px ${l.color}25` : "none",
          }}
        >
          <div
            className="font-bold text-[11px] mb-1 leading-tight"
            style={{ color: active ? "#FFFFFF" : "#1C252C" }}
          >
            {sd.name}
          </div>
          <div className="flex justify-between items-center">
            <span
              className="text-[9px] font-extrabold"
              style={{ color: active ? "rgba(255,255,255,0.9)" : l.color }}
            >
              {l.label}
            </span>
            <span
              className="text-[9px]"
              style={{ color: active ? "rgba(255,255,255,0.65)" : "#6B7280" }}
            >
              ${sd.itSpend}M · {sd.debtPct}%
            </span>
          </div>
          <DimRow sd={sd} dark={active} />
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px]">
        <p className="font-bold text-xs">{sd.name}</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          Debt: {l.label} · Spend: ${sd.itSpend}M · Cost: ${debtCost(sd).toFixed(1)}M
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
