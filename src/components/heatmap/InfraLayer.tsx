"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getLevel, debtCost } from "@/lib/scoring";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="overflow-hidden border-2 border-bby-blue/20 py-0">
      <CardHeader
        onClick={onToggle}
        className="cursor-pointer flex justify-between items-center px-5 py-3.5 bg-bby-blue-light/50 border-l-4 border-l-bby-blue"
      >
        <div className="flex items-center gap-3">
          <span className="text-base">⚙️</span>
          <div>
            <div className="text-bby-blue font-display font-semibold text-base tracking-wide">
              Enterprise Technology & Infrastructure
            </div>
            <div className="text-muted-foreground text-sm mt-0.5 font-body">
              Foundation layer — enables / constrains every domain above · ${spend}M · $
              {cost.toFixed(1)}M debt cost
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-xs font-medium"
            style={{
              backgroundColor: peakLevel.bg,
              color: peakLevel.color,
              borderColor: `${peakLevel.color}40`,
            }}
          >
            Peak: {peakLevel.label}
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
              {sds.map((sd) => {
                const l = getLevel(sd.debt);
                return (
                  <Badge
                    key={sd.id}
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(sd);
                    }}
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
                className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
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
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
