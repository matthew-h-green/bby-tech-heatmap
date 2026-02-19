"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Heatmap" },
  { href: "/summary", label: "Summary" },
  { href: "/export", label: "Export" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="relative rounded-xl mb-4 overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1C252C 0%, #0D1117 60%, #0A0F14 100%)",
        }}
      />
      {/* Subtle grid dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Bottom accent line — luminous yellow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #FFED31 20%, #FFED31 80%, transparent 100%)",
          opacity: 0.6,
        }}
      />
      {/* Content */}
      <div className="relative px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Logo with glow */}
          <div className="flex items-center shrink-0 relative">
            <div
              className="absolute -inset-2 rounded-lg opacity-20 blur-md"
              style={{ background: "#FFED31" }}
            />
            <div className="relative flex items-center">
              <div className="bg-bby-yellow rounded-l px-2.5 py-1.5 font-display font-extrabold text-sm text-bby-dark tracking-tight leading-none">
                BEST
              </div>
              <div className="bg-bby-yellow rounded-r px-2.5 py-1.5 font-display font-extrabold text-sm text-bby-dark tracking-tight leading-none border-l border-black/10">
                BUY
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <h1 className="font-display text-white font-extrabold text-base tracking-wide">
              Tech Debt Heatmap
            </h1>
            <p className="text-white/35 text-[10px] mt-0.5 font-body tracking-wide">
              Click any domain to inspect or edit · All values illustrative
            </p>
          </div>
        </div>
        <nav className="flex gap-1.5">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative rounded-md px-4 py-1.5 font-display font-bold text-[11px] transition-all duration-200",
                  isActive
                    ? "bg-bby-yellow text-bby-dark"
                    : "bg-white/5 text-white/50 border border-white/10 hover:text-white/80 hover:bg-white/10 hover:border-white/20"
                )}
              >
                {isActive && (
                  <div
                    className="absolute -inset-1 rounded-lg opacity-20 blur-sm -z-10"
                    style={{ background: "#FFED31" }}
                  />
                )}
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
