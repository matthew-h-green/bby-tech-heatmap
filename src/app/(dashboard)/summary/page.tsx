"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useHeatmap } from "@/context/HeatmapContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
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
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      <motion.div variants={fadeIn} className="col-span-1 lg:col-span-2">
        <Card>
          <CardContent className="p-5">
            <Quadrant allSDs={allSubdomains} onDotClick={handleSelect} />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={fadeIn}>
        <Card>
          <CardContent className="p-5">
            <DomainBars domains={domains} infraSds={infraSds} />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={fadeIn}>
        <Card>
          <CardContent className="p-5">
            <TopFive allSDs={allSubdomains} onSelect={handleSelect} />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={fadeIn} className="col-span-1 lg:col-span-2">
        <Card>
          <CardContent className="p-5">
            <Waterfall allSDs={allSubdomains} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
