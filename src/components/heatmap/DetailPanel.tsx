"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Bug #1 fix: sync internal state when sd prop changes
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
      className="bg-white rounded-lg overflow-hidden border border-bby-mid shadow-xl"
    >
      {/* Header */}
      <div className="bg-bby-dark px-3.5 py-3 flex justify-between items-start">
        <div>
          <div className="text-bby-yellow font-extrabold text-[13px] leading-tight">
            {d.name}
          </div>
          <div className="mt-1 flex gap-1.5 flex-wrap">
            <span
              className="rounded px-1.5 py-px text-[9px] font-bold"
              style={{
                background: l.bg,
                color: l.color,
                border: `1px solid ${l.color}40`,
              }}
            >
              {l.label} Debt
            </span>
            <span
              className="rounded px-1.5 py-px text-[9px] font-bold"
              style={{
                background: "#F3F4F6",
                color: STRAT_COLOR[d.strategic],
                border: `1px solid ${STRAT_COLOR[d.strategic]}30`,
              }}
            >
              {d.strategic}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border border-white/20 rounded text-white/60 cursor-pointer p-1 hover:text-white/90 hover:border-white/40 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-3.5 max-h-[72vh] overflow-y-auto">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2 mb-3.5">
          {[
            { label: "IT Spend", value: `$${d.itSpend}M`, color: BB.blue },
            { label: "Debt Interest", value: `${d.debtPct}%`, color: l.color },
            { label: "Debt Cost", value: `$${debtCost(d).toFixed(1)}M`, color: "#A63D2F" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-bby-bg rounded-md px-2.5 py-2 text-center border border-bby-mid"
            >
              <div className="text-[8px] text-bby-muted font-bold uppercase tracking-wider">
                {kpi.label}
              </div>
              <div className="text-base font-black mt-0.5" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        {/* Debt Level */}
        <div className="mb-3">
          <div className="text-[9px] font-extrabold text-bby-muted uppercase tracking-wider mb-1.5">
            Tech Debt Level
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {DEBT_LEVELS.map((dl) => (
              <button
                key={dl.score}
                onClick={() => set("debt", dl.score)}
                className="rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition-all duration-150"
                style={{
                  background: d.debt === dl.score ? dl.color : dl.bg,
                  color: d.debt === dl.score ? "#fff" : dl.color,
                  border: `1px solid ${dl.color}50`,
                }}
              >
                {dl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Strategic Importance */}
        <div className="mb-3.5">
          <div className="text-[9px] font-extrabold text-bby-muted uppercase tracking-wider mb-1.5">
            Strategic Importance
          </div>
          <div className="flex gap-1.5">
            {STRATEGIC.map((s) => (
              <button
                key={s}
                onClick={() => set("strategic", s as StrategicLevel)}
                className="rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition-all duration-150"
                style={{
                  background: d.strategic === s ? BB.dark : "#F3F4F6",
                  color: d.strategic === s ? BB.yellow : BB.muted,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Numeric Fields */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          {[
            { key: "itSpend" as const, label: "IT Spend ($M)" },
            { key: "debtPct" as const, label: "Debt Interest (%)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <div className="text-[9px] font-extrabold text-bby-muted uppercase tracking-wider mb-1">
                {label}
              </div>
              <Input
                type="number"
                value={d[key]}
                onChange={(e) => set(key, Math.max(0, +e.target.value))}
                className="h-8 text-xs"
                min={0}
              />
            </div>
          ))}
        </div>

        {/* Dimension Scores */}
        <div className="mb-3.5">
          <div className="text-[9px] font-extrabold text-bby-muted uppercase tracking-wider mb-2">
            Dimensions (1 = Low · 5 = High)
          </div>
          <div className="flex flex-col gap-2">
            {DIMS.map((dim) => {
              const s = d[dim.key];
              const c = dimColor(s);
              return (
                <div key={dim.key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-bby-dark">
                      {dim.icon} {dim.label}
                    </span>
                    <span className="text-[9px] text-bby-muted">{dim.desc}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {([1, 2, 3, 4, 5] as const).map((n) => (
                      <button
                        key={n}
                        onClick={() => set(dim.key, n)}
                        className="flex-1 h-6 rounded text-[10px] font-extrabold cursor-pointer flex items-center justify-center transition-all duration-150"
                        style={{
                          background: n <= s ? c : `${c}20`,
                          border: `1px solid ${c}40`,
                          color: n <= s ? "#fff" : c,
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

        {/* Tags: Strengths and Opportunities */}
        {([
          { field: "strengths" as const, label: "Strengths", color: "#3A7D5C", bg: "#EAF4EE" },
          { field: "opportunities" as const, label: "Opportunities", color: "#C47B2B", bg: "#FBF1E3" },
        ]).map(({ field, label, color, bg }) => (
          <div key={field} className="mb-3">
            <div className="text-[9px] font-extrabold text-bby-muted uppercase tracking-wider mb-1.5">
              {label}
            </div>
            <div className="flex flex-col gap-[3px]">
              {d[field].map((t, i) => (
                <div
                  key={i}
                  className="rounded-[5px] px-2.5 py-1.5 text-[10px] font-semibold flex justify-between items-center"
                  style={{ background: bg, color, border: `1px solid ${color}25` }}
                >
                  {t}
                  <button
                    onClick={() => rmTag(field, i)}
                    className="opacity-45 hover:opacity-100 cursor-pointer transition-opacity"
                    style={{ color }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => openTagDialog(field)}
                className="border border-dashed border-bby-mid rounded-[5px] px-2.5 py-1.5 text-[10px] text-bby-muted cursor-pointer text-center hover:border-bby-muted transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={10} /> Add
              </button>
            </div>
          </div>
        ))}

        <Button
          onClick={() => {
            onSave(d);
            onClose();
          }}
          className="w-full bg-bby-blue hover:bg-bby-blue/90 text-white font-extrabold text-xs mt-1"
        >
          Save Changes
        </Button>
      </div>

      {/* Tag Dialog — Bug #3 fix: replaces window.prompt() */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Add {tagField === "strengths" ? "Strength" : "Opportunity"}
            </DialogTitle>
          </DialogHeader>
          <Input
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
            placeholder={`Enter ${tagField === "strengths" ? "strength" : "opportunity"}...`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") addTag();
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addTag} disabled={!tagValue.trim()}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
