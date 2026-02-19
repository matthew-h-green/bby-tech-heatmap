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

export function DomainBlock({ domain, activeId, onSelect, open, onToggle }: DomainBlockProps) {
  const peak = Math.max(...domain.subdomains.map((d) => d.debt));
  const pl = getLevel(peak);
  const spend = domain.subdomains.reduce((s, d) => s + d.itSpend, 0);
  const cost = domain.subdomains.reduce((s, d) => s + debtCost(d), 0);
  const hdrHex = headerOpacity(peak);

  return (
    <div
      className="rounded-lg overflow-hidden shadow-sm"
      style={{ border: `1px solid ${pl.color}35` }}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="px-3.5 py-2.5 cursor-pointer flex justify-between items-center"
        style={{
          background: `${pl.color}${hdrHex}`,
          borderBottom: `1px solid ${pl.color}25`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{domain.icon}</span>
          <div>
            <div className="text-bby-dark font-extrabold text-xs">{domain.label}</div>
            <div className="text-bby-muted text-[9px] mt-0.5">
              {domain.subdomains.length} sub-domains · ${spend}M · ${cost.toFixed(1)}M debt cost
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded px-2 py-0.5 text-[9px] font-bold"
            style={{
              background: pl.bg,
              color: pl.color,
              border: `1px solid ${pl.color}40`,
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

      {/* Collapsed: tag list */}
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
              {domain.subdomains.map((sd) => {
                const l = getLevel(sd.debt);
                return (
                  <span
                    key={sd.id}
                    onClick={() => onSelect(sd)}
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

        {/* Expanded: heat cells */}
        {open && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[7px] bg-white">
              {domain.subdomains.map((sd) => (
                <HeatCell key={sd.id} sd={sd} onClick={onSelect} active={activeId === sd.id} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
