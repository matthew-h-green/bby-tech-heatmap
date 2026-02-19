"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getLevel, headerOpacity, debtCost } from "@/lib/scoring";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <Card className="overflow-hidden py-0">
      <CardHeader
        onClick={onToggle}
        className="cursor-pointer flex justify-between items-center px-5 py-3.5 border-l-4"
        style={{ borderLeftColor: pl.color, background: `${pl.color}${headerOpacity(peak)}` }}
      >
        <div className="flex items-center gap-3">
          <span className="text-base">{domain.icon}</span>
          <div>
            <div className="text-bby-dark font-display font-semibold text-base">
              {domain.label}
            </div>
            <div className="text-muted-foreground text-sm mt-0.5 font-body">
              {domain.subdomains.length} sub-domains · ${spend}M · ${cost.toFixed(1)}M debt cost
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-xs font-medium"
            style={{
              backgroundColor: pl.bg,
              color: pl.color,
              borderColor: `${pl.color}40`,
            }}
          >
            Peak: {pl.label}
          </Badge>
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground text-sm inline-block"
          >
            ▶
          </motion.span>
        </div>
      </CardHeader>

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
            <div className="px-5 py-3 flex gap-2 flex-wrap">
              {domain.subdomains.map((sd) => {
                const l = getLevel(sd.debt);
                return (
                  <Badge
                    key={sd.id}
                    variant="outline"
                    onClick={() => onSelect(sd)}
                    className="text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: l.bg,
                      color: l.color,
                      borderColor: `${l.color}30`,
                    }}
                  >
                    {sd.name}
                  </Badge>
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
            <CardContent className="p-0">
              <motion.div
                className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
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
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
