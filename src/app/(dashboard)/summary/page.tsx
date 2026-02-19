"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useHeatmap } from "@/context/HeatmapContext";
import { Quadrant } from "@/components/summary/Quadrant";
import { DomainBars } from "@/components/summary/DomainBars";
import { TopFive } from "@/components/summary/TopFive";
import { Waterfall } from "@/components/summary/Waterfall";

const cascade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fromTop = {
  hidden: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const fromLeft = {
  hidden: { opacity: 0, x: -18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const fromRight = {
  hidden: { opacity: 0, x: 18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const fromBottom = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

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
      variants={cascade}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 gap-3"
    >
      <motion.div
        variants={fromTop}
        className="glass-card rounded-xl p-4 col-span-1 lg:col-span-2"
      >
        <Quadrant allSDs={allSubdomains} onDotClick={handleSelect} />
      </motion.div>
      <motion.div variants={fromLeft} className="glass-card rounded-xl p-4">
        <DomainBars domains={domains} infraSds={infraSds} />
      </motion.div>
      <motion.div variants={fromRight} className="glass-card rounded-xl p-4">
        <TopFive allSDs={allSubdomains} onSelect={handleSelect} />
      </motion.div>
      <motion.div
        variants={fromBottom}
        className="glass-card rounded-xl p-4 col-span-1 lg:col-span-2"
      >
        <Waterfall allSDs={allSubdomains} />
      </motion.div>
    </motion.div>
  );
}
