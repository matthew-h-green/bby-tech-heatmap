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
    <header className="bg-[#1C252C] rounded-xl mb-5 border-b-2 border-[#FFED31]/40">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center shrink-0">
            <div className="bg-bby-yellow rounded-l px-2.5 py-1.5 font-display font-bold text-sm text-bby-dark tracking-tight leading-none">
              BEST
            </div>
            <div className="bg-bby-yellow rounded-r px-2.5 py-1.5 font-display font-bold text-sm text-bby-dark tracking-tight leading-none border-l border-black/10">
              BUY
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <h1 className="font-display text-white font-semibold text-base tracking-wide">
              Tech Debt Heatmap
            </h1>
            <p className="text-white/40 text-xs mt-0.5 font-body">
              Click any domain to inspect or edit
            </p>
          </div>
        </div>
        <nav className="flex gap-2">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-5 py-2 font-display font-medium text-sm transition-colors duration-150",
                  isActive
                    ? "bg-bby-yellow text-bby-dark"
                    : "text-white/50 hover:text-white/80 hover:bg-white/10"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
