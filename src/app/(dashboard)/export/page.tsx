"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Printer, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useHeatmap } from "@/context/HeatmapContext";
import { Quadrant } from "@/components/summary/Quadrant";
import { DomainBars } from "@/components/summary/DomainBars";
import { TopFive } from "@/components/summary/TopFive";
import { Waterfall } from "@/components/summary/Waterfall";
import { getLevel, debtCost } from "@/lib/scoring";
import { DIMS } from "@/lib/constants";

export default function ExportPage() {
  const { allSubdomains, domains, infraSds } = useHeatmap();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handlePDF = useCallback(async () => {
    const el = printRef.current;
    if (!el) return;

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#FFFFFF",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("bby-tech-debt-heatmap.pdf");
  }, []);

  const handleCSV = useCallback(() => {
    const headers = [
      "Domain",
      "Subdomain",
      "Debt Score",
      "Debt Level",
      "Strategic Importance",
      "IT Spend ($M)",
      "Debt Interest (%)",
      "Debt Cost ($M)",
      ...DIMS.map((d) => d.label),
      "Strengths",
      "Opportunities",
    ];

    const domainMap = new Map<string, string>();
    domains.forEach((d) => {
      d.subdomains.forEach((sd) => domainMap.set(sd.id, d.label));
    });

    const rows = allSubdomains.map((sd) => [
      domainMap.get(sd.id) ?? "Infrastructure",
      sd.name,
      sd.debt,
      getLevel(sd.debt).label,
      sd.strategic,
      sd.itSpend,
      sd.debtPct,
      debtCost(sd).toFixed(1),
      sd.bizValue,
      sd.skillsObs,
      sd.talentConc,
      sd.vendorDep,
      `"${sd.strengths.join("; ")}"`,
      `"${sd.opportunities.join("; ")}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bby-tech-debt-data.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [allSubdomains, domains]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Actions bar */}
      <Card className="mb-4 no-print">
        <CardContent className="p-5 flex flex-wrap gap-3 items-center">
          <h2 className="font-display font-semibold text-base text-bby-dark mr-auto">Export & Print</h2>
          <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
            <Printer size={14} /> Print
          </Button>
          <Button onClick={handlePDF} variant="outline" size="sm" className="gap-2">
            <Download size={14} /> Download PDF
          </Button>
          <Button onClick={handleCSV} variant="outline" size="sm" className="gap-2">
            <FileSpreadsheet size={14} /> Export CSV
          </Button>
        </CardContent>
      </Card>

      {/* Printable content */}
      <div ref={printRef} className="space-y-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center shrink-0">
                <div className="bg-bby-yellow rounded-l px-2.5 py-1.5 font-display font-bold text-sm text-bby-dark tracking-tight leading-none">
                  BEST
                </div>
                <div className="bg-bby-yellow rounded-r px-2.5 py-1.5 font-display font-bold text-sm text-bby-dark tracking-tight leading-none border-l border-black/10">
                  BUY
                </div>
              </div>
              <div>
                <h1 className="font-display font-semibold text-lg text-bby-dark">
                  Technology Debt Assessment
                </h1>
                <p className="text-sm text-muted-foreground font-body">
                  Portfolio overview — All values illustrative
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Addressable IT Spend", value: `$${allSubdomains.reduce((s, d) => s + d.itSpend, 0)}M` },
                { label: "Est. Annual Debt Cost", value: `$${allSubdomains.reduce((s, d) => s + debtCost(d), 0).toFixed(1)}M` },
                { label: "Avg Debt Score", value: `${(allSubdomains.reduce((s, d) => s + d.debt, 0) / allSubdomains.length).toFixed(1)} / 5` },
                { label: "High/Very High", value: `${allSubdomains.filter((d) => d.debt >= 4).length} of ${allSubdomains.length}` },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide font-body">
                    {kpi.label}
                  </div>
                  <div className="text-lg font-display font-bold text-bby-dark mt-0.5">{kpi.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Quadrant allSDs={allSubdomains} onDotClick={() => {}} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 print-break">
          <Card>
            <CardContent className="p-5">
              <DomainBars domains={domains} infraSds={infraSds} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <TopFive allSDs={allSubdomains} onSelect={() => {}} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-5">
            <Waterfall allSDs={allSubdomains} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
