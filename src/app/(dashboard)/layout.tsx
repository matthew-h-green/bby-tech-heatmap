"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HeatmapProvider } from "@/context/HeatmapContext";
import { Header } from "@/components/layout/Header";
import { KPIBar } from "@/components/layout/KPIBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.replace("/login");
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return null;
  }

  return (
    <HeatmapProvider>
      <div className="min-h-screen px-6 py-6 lg:px-8 lg:py-8 max-w-[1600px] mx-auto">
        <Header />
        <KPIBar />
        {children}
      </div>
    </HeatmapProvider>
  );
}
