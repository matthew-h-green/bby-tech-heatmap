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
    <header className="bg-bby-dark rounded-lg px-5 py-3.5 mb-3.5 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="flex items-center shrink-0">
          <div className="bg-bby-yellow rounded-l-[4px] px-2 py-1.5 font-black text-sm text-bby-dark tracking-tight leading-none">
            BEST
          </div>
          <div className="bg-bby-yellow rounded-r-[4px] px-2 py-1.5 font-black text-sm text-bby-dark tracking-tight leading-none border-l border-black/10">
            BUY
          </div>
        </div>
        <div className="w-px h-7 bg-white/15" />
        <div>
          <h1 className="text-white font-extrabold text-[15px] tracking-wide">
            Tech Debt Heatmap
          </h1>
          <p className="text-white/40 text-[10px] mt-0.5">
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
                "rounded-[5px] px-3.5 py-1.5 font-bold text-[11px] transition-all duration-150",
                isActive
                  ? "bg-bby-yellow text-bby-dark"
                  : "bg-transparent text-white/55 border border-white/20 hover:text-white/80 hover:border-white/40"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
