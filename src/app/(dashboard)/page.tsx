"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHeatmap } from "@/context/HeatmapContext";
import { DomainBlock } from "@/components/heatmap/DomainBlock";
import { InfraLayer } from "@/components/heatmap/InfraLayer";
import { DetailPanel } from "@/components/heatmap/DetailPanel";
import { DebtLegend } from "@/components/heatmap/DebtLegend";

const pageStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const sectionItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const domainStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const domainItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function HeatmapPage() {
  const { domains, infraSds, selected, openState, select, toggle, save } = useHeatmap();

  return (
    <motion.div variants={pageStagger} initial="hidden" animate="show">
      <div className="flex gap-3 items-start">
        {/* Main grid */}
        <div className="flex-1 min-w-0">
          <motion.div variants={sectionItem}>
            <DebtLegend />
          </motion.div>
          <div className="flex flex-col gap-2">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-2"
              variants={domainStagger}
              initial="hidden"
              animate="show"
            >
              {domains.map((d) => (
                <motion.div key={d.id} variants={domainItem}>
                  <DomainBlock
                    domain={d}
                    activeId={selected?.id}
                    onSelect={select}
                    open={!!openState[d.id]}
                    onToggle={() => toggle(d.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Infrastructure foundation */}
            <motion.div className="relative pt-2.5" variants={sectionItem}>
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 bg-bby-blue text-white text-[8px] font-extrabold font-display px-2.5 py-0.5 rounded-full uppercase tracking-widest z-10">
                Foundation Layer
              </div>
              <InfraLayer
                sds={infraSds}
                activeId={selected?.id}
                onSelect={select}
                open={!!openState.infra}
                onToggle={() => toggle("infra")}
              />
            </motion.div>
          </div>

          <motion.p
            className="mt-2.5 text-[9px] text-[#C0C4CB] text-center font-body"
            variants={sectionItem}
          >
            All domain scores, spend figures and characterisations are illustrative — intended to
            prompt discussion, not assert findings.
          </motion.p>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              className="w-[300px] shrink-0 sticky top-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <DetailPanel sd={selected} onClose={() => select(null)} onSave={save} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
