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

const cellStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const cellItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function InfraLayer({ sds, activeId, onSelect, open, onToggle }: InfraLayerProps) {
  const spend = sds.reduce((s, d) => s + d.itSpend, 0);
  const cost = sds.reduce((s, d) => s + debtCost(d), 0);
  const peak = Math.max(...sds.map((d) => d.debt));
  const peakLevel = getLevel(peak);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "2px solid rgba(0,69,190,0.25)",
        background: "rgba(232,239,254,0.4)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px rgba(0,69,190,0.06)",
      }}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="relative px-4 py-3 cursor-pointer flex justify-between items-center"
        style={{
          background: "linear-gradient(135deg, rgba(232,239,254,0.9) 0%, rgba(194,212,248,0.5) 100%)",
          borderBottom: "1px solid #C2D4F8",
        }}
      >
        {/* Left accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background: "linear-gradient(180deg, #0045BE 0%, #0045BE50 100%)",
          }}
        />
        <div className="flex items-center gap-2.5">
          <span className="text-sm">⚙️</span>
          <div>
            <div className="text-bby-blue font-display font-extrabold text-xs tracking-widest">
              ENTERPRISE TECHNOLOGY & INFRASTRUCTURE
            </div>
            <div className="text-bby-muted text-[9px] mt-0.5 font-body">
              Foundation layer — enables / constrains every domain above · ${spend}M · $
              {cost.toFixed(1)}M debt cost
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="rounded-md px-2 py-0.5 text-[9px] font-bold font-display"
            style={{
              background: peakLevel.bg,
              color: peakLevel.color,
              border: `1px solid ${peakLevel.color}30`,
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
            <div className="px-3.5 py-2 flex gap-1.5 flex-wrap bg-white/50">
              {sds.map((sd) => {
                const l = getLevel(sd.debt);
                return (
                  <span
                    key={sd.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(sd);
                    }}
                    className="rounded-md px-[7px] py-0.5 text-[9px] font-bold font-display cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      background: l.bg,
                      color: l.color,
                      border: `1px solid ${l.color}25`,
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
            <motion.div
              className="p-2.5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 bg-white/40"
              variants={cellStagger}
              initial="hidden"
              animate="show"
            >
              {sds.map((sd) => (
                <motion.div key={sd.id} variants={cellItem}>
                  <HeatCell sd={sd} onClick={onSelect} active={activeId === sd.id} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
