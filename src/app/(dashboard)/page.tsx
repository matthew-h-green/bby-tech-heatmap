"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHeatmap } from "@/context/HeatmapContext";
import { DomainBlock } from "@/components/heatmap/DomainBlock";
import { InfraLayer } from "@/components/heatmap/InfraLayer";
import { DetailPanel } from "@/components/heatmap/DetailPanel";
import { DebtLegend } from "@/components/heatmap/DebtLegend";

export default function HeatmapPage() {
  const { domains, infraSds, selected, openState, select, toggle, save } = useHeatmap();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-3 items-start">
        {/* Main grid */}
        <div className="flex-1 min-w-0">
          <DebtLegend />
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {domains.map((d) => (
                <DomainBlock
                  key={d.id}
                  domain={d}
                  activeId={selected?.id}
                  onSelect={select}
                  open={!!openState[d.id]}
                  onToggle={() => toggle(d.id)}
                />
              ))}
            </div>

            {/* Infrastructure foundation */}
            <div className="relative pt-2.5">
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 bg-bby-blue text-white text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest z-10">
                Foundation Layer
              </div>
              <InfraLayer
                sds={infraSds}
                activeId={selected?.id}
                onSelect={select}
                open={!!openState.infra}
                onToggle={() => toggle("infra")}
              />
            </div>
          </div>

          <p className="mt-2.5 text-[9px] text-[#C0C4CB] text-center">
            All domain scores, spend figures and characterisations are illustrative — intended to
            prompt discussion, not assert findings.
          </p>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              className="w-[300px] shrink-0 sticky top-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <DetailPanel sd={selected} onClose={() => select(null)} onSave={save} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
