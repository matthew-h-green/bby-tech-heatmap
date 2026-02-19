"use client";

import { motion } from "framer-motion";
import { useHeatmap } from "@/context/HeatmapContext";
import { DomainBlock } from "@/components/heatmap/DomainBlock";
import { InfraLayer } from "@/components/heatmap/InfraLayer";
import { DetailPanel } from "@/components/heatmap/DetailPanel";
import { DebtLegend } from "@/components/heatmap/DebtLegend";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
    <>
      <motion.div variants={pageStagger} initial="hidden" animate="show">
        <motion.div variants={sectionItem}>
          <DebtLegend />
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
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

          <motion.div className="relative pt-4" variants={sectionItem}>
            <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-bby-blue text-white text-xs font-semibold font-display px-3 py-1 rounded-full uppercase tracking-wider z-10">
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
          className="mt-4 text-xs text-muted-foreground text-center font-body"
          variants={sectionItem}
        >
          All domain scores, spend figures and characterisations are illustrative — intended to
          prompt discussion, not assert findings.
        </motion.p>
      </motion.div>

      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) select(null); }}>
        <SheetContent side="right" className="w-[480px] sm:w-[520px] p-0 overflow-hidden">
          {selected && (
            <DetailPanel sd={selected} onClose={() => select(null)} onSave={save} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
