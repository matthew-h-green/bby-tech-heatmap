"use client";

import { HeatmapProvider } from "@/context/HeatmapContext";
import { Header } from "@/components/layout/Header";
import { KPIBar } from "@/components/layout/KPIBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeatmapProvider>
      <div className="min-h-screen p-4 max-w-[1600px] mx-auto">
        <Header />
        <KPIBar />
        {children}
      </div>
    </HeatmapProvider>
  );
}
