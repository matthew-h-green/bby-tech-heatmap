"use client";

import { motion } from "framer-motion";
import { getLevel, debtOpacity, debtCost } from "@/lib/scoring";
import { Badge } from "@/components/ui/badge";
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
          transition={{ duration: 0.15 }}
          className="rounded-lg px-3.5 py-3 cursor-pointer border-l-4 transition-shadow"
          style={{
            background: active ? l.color : `${l.color}${hex}`,
            borderLeftColor: l.color,
            boxShadow: active
              ? `0 0 0 2px ${l.color}, 0 4px 12px ${l.color}20`
              : "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="font-display font-semibold text-sm mb-1.5 leading-tight"
            style={{ color: active ? "#FFFFFF" : "#1C252C" }}
          >
            {sd.name}
          </div>
          <div className="flex justify-between items-center">
            <Badge
              variant="outline"
              className="text-xs font-medium px-2 py-0 h-5 border"
              style={{
                backgroundColor: active ? "rgba(255,255,255,0.2)" : l.bg,
                color: active ? "rgba(255,255,255,0.95)" : l.color,
                borderColor: active ? "rgba(255,255,255,0.3)" : `${l.color}40`,
              }}
            >
              {l.label}
            </Badge>
            <span
              className="text-xs font-body"
              style={{ color: active ? "rgba(255,255,255,0.7)" : "#6B7280" }}
            >
              ${sd.itSpend}M · {sd.debtPct}%
            </span>
          </div>
          <DimRow sd={sd} dark={active} />
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px]">
        <p className="font-semibold text-xs">{sd.name}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Debt: {l.label} · Spend: ${sd.itSpend}M · Cost: ${debtCost(sd).toFixed(1)}M
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
