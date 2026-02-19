"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useHeatmap } from "@/context/HeatmapContext";
import { Quadrant } from "@/components/summary/Quadrant";
import { DomainBars } from "@/components/summary/DomainBars";
import { TopFive } from "@/components/summary/TopFive";
import { Waterfall } from "@/components/summary/Waterfall";

export default function SummaryPage() {
  const { allSubdomains, domains, infraSds, select } = useHeatmap();
  const router = useRouter();

  const handleSelect = (sd: Parameters<typeof select>[0]) => {
    if (sd) {
      select(sd);
      router.push("/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-3"
    >
      <div className="bg-white rounded-lg p-4 border border-bby-mid col-span-1 lg:col-span-2">
        <Quadrant allSDs={allSubdomains} onDotClick={handleSelect} />
      </div>
      <div className="bg-white rounded-lg p-4 border border-bby-mid">
        <DomainBars domains={domains} infraSds={infraSds} />
      </div>
      <div className="bg-white rounded-lg p-4 border border-bby-mid">
        <TopFive allSDs={allSubdomains} onSelect={handleSelect} />
      </div>
      <div className="bg-white rounded-lg p-4 border border-bby-mid col-span-1 lg:col-span-2">
        <Waterfall allSDs={allSubdomains} />
      </div>
    </motion.div>
  );
}
