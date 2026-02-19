"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getLevel, dimColor, debtCost } from "@/lib/scoring";
import { DEBT_LEVELS, DIMS, STRATEGIC, STRAT_COLOR, BB } from "@/lib/constants";
import type { Subdomain, StrategicLevel } from "@/types/heatmap";

interface DetailPanelProps {
  sd: Subdomain;
  onClose: () => void;
  onSave: (sd: Subdomain) => void;
}

export function DetailPanel({ sd, onClose, onSave }: DetailPanelProps) {
  const [d, setD] = useState<Subdomain>({ ...sd });
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [tagField, setTagField] = useState<"strengths" | "opportunities">("strengths");
  const [tagValue, setTagValue] = useState("");

  useEffect(() => {
    setD({ ...sd });
  }, [sd]);

  const l = getLevel(d.debt);

  const set = <K extends keyof Subdomain>(key: K, value: Subdomain[K]) =>
    setD((p) => ({ ...p, [key]: value }));

  const openTagDialog = (field: "strengths" | "opportunities") => {
    setTagField(field);
    setTagValue("");
    setTagDialogOpen(true);
  };

  const addTag = () => {
    if (tagValue.trim()) {
      set(tagField, [...d[tagField], tagValue.trim()]);
      setTagDialogOpen(false);
      setTagValue("");
    }
  };

  const rmTag = (field: "strengths" | "opportunities", index: number) =>
    set(field, d[field].filter((_, j) => j !== index));

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,69,190,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="relative px-4 py-3.5 flex justify-between items-start overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1C252C 0%, #0B1015 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,1) 10px, rgba(255,255,255,1) 11px)",
          }}
        />
        <div className="relative">
          <div className="font-display text-bby-yellow font-extrabold text-[13px] leading-tight">
            {d.name}
          </div>
          <div className="mt-1.5 flex gap-1.5 flex-wrap">
            <span
              className="rounded-md px-1.5 py-0.5 text-[9px] font-bold font-display"
              style={{ background: l.bg, color: l.color, border: `1px solid ${l.color}40` }}
            >
              {l.label} Debt
            </span>
            <span
              className="rounded-md px-1.5 py-0.5 text-[9px] font-bold font-display"
              style={{ background: "#F3F4F6", color: STRAT_COLOR[d.strategic], border: `1px solid ${STRAT_COLOR[d.strategic]}30` }}
            >
              {d.strategic}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="relative bg-white/5 border border-white/15 rounded-md text-white/50 cursor-pointer p-1 hover:text-white/90 hover:bg-white/10 transition-all"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 max-h-[72vh] overflow-y-auto custom-scrollbar">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "IT Spend", value: `$${d.itSpend}M`, color: BB.blue },
            { label: "Debt Interest", value: `${d.debtPct}%`, color: l.color },
            { label: "Debt Cost", value: `$${debtCost(d).toFixed(1)}M`, color: "#A63D2F" },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card rounded-lg px-2.5 py-2 text-center">
              <div className="text-[8px] text-bby-muted font-semibold uppercase tracking-widest font-body">{kpi.label}</div>
              <div className="text-base font-display font-extrabold mt-0.5" style={{ color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <Separator className="mb-3" />

        {/* Debt Level */}
        <div className="mb-3.5">
          <div className="text-[9px] font-display font-extrabold text-bby-muted uppercase tracking-widest mb-2">Tech Debt Level</div>
          <div className="flex gap-1.5 flex-wrap">
            {DEBT_LEVELS.map((dl) => (
              <button
                key={dl.score}
                onClick={() => set("debt", dl.score)}
                className="rounded-md px-2.5 py-1 text-[10px] font-bold font-display cursor-pointer transition-all duration-150"
                style={{
                  background: d.debt === dl.score ? dl.color : dl.bg,
                  color: d.debt === dl.score ? "#fff" : dl.color,
                  border: `1px solid ${dl.color}40`,
                  boxShadow: d.debt === dl.score ? `0 2px 8px ${dl.color}30` : "none",
                }}
              >
                {dl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Strategic Importance */}
        <div className="mb-3.5">
          <div className="text-[9px] font-display font-extrabold text-bby-muted uppercase tracking-widest mb-2">Strategic Importance</div>
          <div className="flex gap-1.5">
            {STRATEGIC.map((s) => (
              <button
                key={s}
                onClick={() => set("strategic", s as StrategicLevel)}
                className="rounded-md px-2.5 py-1 text-[10px] font-bold font-display cursor-pointer transition-all duration-150"
                style={{
                  background: d.strategic === s ? BB.dark : "#F3F4F6",
                  color: d.strategic === s ? BB.yellow : BB.muted,
                  boxShadow: d.strategic === s ? "0 2px 8px rgba(28,37,44,0.3)" : "none",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Separator className="mb-3" />

        {/* Numeric Fields */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          {[
            { key: "itSpend" as const, label: "IT Spend ($M)" },
            { key: "debtPct" as const, label: "Debt Interest (%)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <div className="text-[9px] font-display font-extrabold text-bby-muted uppercase tracking-widest mb-1">{label}</div>
              <Input type="number" value={d[key]} onChange={(e) => set(key, Math.max(0, +e.target.value))} className="h-8 text-xs font-body" min={0} />
            </div>
          ))}
        </div>

        <Separator className="mb-3" />

        {/* Dimension Scores */}
        <div className="mb-3.5">
          <div className="text-[9px] font-display font-extrabold text-bby-muted uppercase tracking-widest mb-2">Dimensions (1 = Low · 5 = High)</div>
          <div className="flex flex-col gap-2.5">
            {DIMS.map((dim) => {
              const s = d[dim.key];
              const c = dimColor(s);
              return (
                <div key={dim.key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-display font-bold text-bby-dark">{dim.icon} {dim.label}</span>
                    <span className="text-[8px] text-bby-muted font-body">{dim.desc}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {([1, 2, 3, 4, 5] as const).map((n) => (
                      <button
                        key={n}
                        onClick={() => set(dim.key, n)}
                        className="flex-1 h-6 rounded-md text-[10px] font-extrabold font-display cursor-pointer flex items-center justify-center transition-all duration-150"
                        style={{
                          background: n <= s ? c : `${c}15`,
                          border: `1px solid ${c}30`,
                          color: n <= s ? "#fff" : c,
                          boxShadow: n <= s ? `0 1px 4px ${c}25` : "none",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="mb-3" />

        {/* Tags */}
        {([
          { field: "strengths" as const, label: "Strengths", color: "#3A7D5C", bg: "#EAF4EE" },
          { field: "opportunities" as const, label: "Opportunities", color: "#C47B2B", bg: "#FBF1E3" },
        ]).map(({ field, label, color, bg }) => (
          <div key={field} className="mb-3">
            <div className="text-[9px] font-display font-extrabold text-bby-muted uppercase tracking-widest mb-1.5">{label}</div>
            <div className="flex flex-col gap-1">
              {d[field].map((t, i) => (
                <div key={i} className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold font-body flex justify-between items-center" style={{ background: bg, color, border: `1px solid ${color}20` }}>
                  {t}
                  <button onClick={() => rmTag(field, i)} className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity" style={{ color }}><X size={12} /></button>
                </div>
              ))}
              <button onClick={() => openTagDialog(field)} className="border border-dashed border-bby-mid rounded-lg px-2.5 py-1.5 text-[10px] text-bby-muted cursor-pointer text-center hover:border-bby-muted transition-colors flex items-center justify-center gap-1 font-body">
                <Plus size={10} /> Add
              </button>
            </div>
          </div>
        ))}

        <Button
          onClick={() => { onSave(d); onClose(); }}
          className="w-full font-display font-extrabold text-xs mt-2 h-10"
          style={{ background: "linear-gradient(135deg, #0045BE 0%, #0035A0 100%)" }}
        >
          Save Changes
        </Button>
      </div>

      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle className="font-display">Add {tagField === "strengths" ? "Strength" : "Opportunity"}</DialogTitle></DialogHeader>
          <Input value={tagValue} onChange={(e) => setTagValue(e.target.value)} placeholder={`Enter ${tagField === "strengths" ? "strength" : "opportunity"}...`} autoFocus className="font-body" onKeyDown={(e) => { if (e.key === "Enter") addTag(); }} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagDialogOpen(false)} className="font-display">Cancel</Button>
            <Button onClick={addTag} disabled={!tagValue.trim()} className="font-display">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
