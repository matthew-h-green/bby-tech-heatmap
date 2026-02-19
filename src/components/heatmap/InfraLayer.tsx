"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getLevel, debtCost } from "@/lib/scoring";
import { HeatCell } from "./HeatCell";
import type { Subdomain } from "@/types/heatmap";

interface InfraLayerProps {
  sds: Subdomain[];
  activeId: string | undefined;
  onSelect: (sd: Subdomain) => void;
  open: boolean;
  onToggle: () => void;
}

export function InfraLayer({ sds, activeId, onSelect, open, onToggle }: InfraLayerProps) {
  const spend = sds.reduce((s, d) => s + d.itSpend, 0);
  const cost = sds.reduce((s, d) => s + debtCost(d), 0);
  // Bug #2 fix: compute peak dynamically instead of hardcoding
  const peak = Math.max(...sds.map((d) => d.debt));
  const peakLevel = getLevel(peak);

  return (
    <div className="rounded-lg overflow-hidden shadow-md" style={{ border: "2px solid #0045BE40" }}>
      {/* Header */}
      <div
        onClick={onToggle}
        className="bg-bby-blue-light px-3.5 py-2.5 cursor-pointer flex justify-between items-center"
        style={{ borderBottom: "1px solid #C2D4F8" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm">⚙️</span>
          <div>
            <div className="text-bby-blue font-extrabold text-xs">
              ENTERPRISE TECHNOLOGY & INFRASTRUCTURE
            </div>
            <div className="text-bby-muted text-[9px] mt-0.5">
              Foundation layer — enables / constrains every domain above · ${spend}M · $
              {cost.toFixed(1)}M debt cost
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded px-2 py-0.5 text-[9px] font-bold"
            style={{
              background: peakLevel.bg,
              color: peakLevel.color,
              border: `1px solid ${peakLevel.color}40`,
            }}
          >
            Peak: {peakLevel.label}
          </span>
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-bby-muted text-[11px] inline-block"
          >
            ▶
          </motion.span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!open && (
          <motion.div
            key="collapsed"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-[7px] flex gap-1.5 flex-wrap bg-white">
              {sds.map((sd) => {
                const l = getLevel(sd.debt);
                return (
                  <span
                    key={sd.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(sd);
                    }}
                    className="rounded px-[7px] py-0.5 text-[9px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      background: l.bg,
                      color: l.color,
                      border: `1px solid ${l.color}35`,
                    }}
                  >
                    {sd.name}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}

        {open && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[7px] bg-white">
              {sds.map((sd) => (
                <HeatCell key={sd.id} sd={sd} onClick={onSelect} active={activeId === sd.id} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
