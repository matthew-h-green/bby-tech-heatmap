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
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="relative rounded-lg px-2.5 py-2 cursor-pointer overflow-hidden"
          style={{
            background: active ? l.color : `${l.color}${hex}`,
            border: active ? `2px solid ${l.color}` : `1px solid ${l.color}30`,
            boxShadow: active
              ? `0 4px 16px ${l.color}30`
              : "0 1px 3px rgba(0,0,0,0.04)",
            animation: active ? "glow-pulse 2s ease-in-out infinite" : "none",
            ["--glow-color" as string]: `${l.color}25`,
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, ${l.color}, ${l.color}80)`,
              opacity: active ? 0 : 1,
            }}
          />
          <div
            className="font-display font-bold text-[11px] mb-1 leading-tight"
            style={{ color: active ? "#FFFFFF" : "#1C252C" }}
          >
            {sd.name}
          </div>
          <div className="flex justify-between items-center">
            <span
              className="text-[9px] font-extrabold font-display"
              style={{ color: active ? "rgba(255,255,255,0.9)" : l.color }}
            >
              {l.label}
            </span>
            <span
              className="text-[9px] font-body"
              style={{ color: active ? "rgba(255,255,255,0.65)" : "#6B7280" }}
            >
              ${sd.itSpend}M · {sd.debtPct}%
            </span>
          </div>
          <DimRow sd={sd} dark={active} />
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px]">
        <p className="font-display font-bold text-xs">{sd.name}</p>
        <p className="text-[10px] text-muted-foreground mt-1 font-body">
          Debt: {l.label} · Spend: ${sd.itSpend}M · Cost: ${debtCost(sd).toFixed(1)}M
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
