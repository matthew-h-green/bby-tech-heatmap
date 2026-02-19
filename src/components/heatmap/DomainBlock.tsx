"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getLevel, headerOpacity, debtCost } from "@/lib/scoring";
import { HeatCell } from "./HeatCell";
import type { Domain, Subdomain } from "@/types/heatmap";

interface DomainBlockProps {
  domain: Domain;
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

export function DomainBlock({ domain, activeId, onSelect, open, onToggle }: DomainBlockProps) {
  const peak = Math.max(...domain.subdomains.map((d) => d.debt));
  const pl = getLevel(peak);
  const spend = domain.subdomains.reduce((s, d) => s + d.itSpend, 0);
  const cost = domain.subdomains.reduce((s, d) => s + debtCost(d), 0);
  const hdrHex = headerOpacity(peak);

  return (
    <div
      className="rounded-xl overflow-hidden glass-card"
      style={{ border: `1px solid ${pl.color}25` }}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="relative px-4 py-3 cursor-pointer flex justify-between items-center"
        style={{
          background: `${pl.color}${hdrHex}`,
          borderBottom: `1px solid ${pl.color}15`,
        }}
      >
        {/* Left accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background: `linear-gradient(180deg, ${pl.color} 0%, ${pl.color}50 100%)`,
          }}
        />
        <div className="flex items-center gap-2.5">
          <span className="text-sm">{domain.icon}</span>
          <div>
            <div className="text-bby-dark font-display font-extrabold text-xs tracking-wide">
              {domain.label}
            </div>
            <div className="text-bby-muted text-[9px] mt-0.5 font-body">
              {domain.subdomains.length} sub-domains · ${spend}M · ${cost.toFixed(1)}M debt cost
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="rounded-md px-2 py-0.5 text-[9px] font-bold font-display"
            style={{
              background: pl.bg,
              color: pl.color,
              border: `1px solid ${pl.color}30`,
            }}
          >
            Peak: {pl.label}
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

      {/* Collapsed: tag list with fade mask */}
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
            <div className="px-3.5 py-2 flex gap-1.5 flex-wrap scroll-fade-mask bg-white/50">
              {domain.subdomains.map((sd) => {
                const l = getLevel(sd.debt);
                return (
                  <span
                    key={sd.id}
                    onClick={() => onSelect(sd)}
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

        {/* Expanded: heat cells with stagger */}
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
              className="p-2.5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 bg-white/40"
              variants={cellStagger}
              initial="hidden"
              animate="show"
            >
              {domain.subdomains.map((sd) => (
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
