"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 bg-[#1C252C] flex justify-between items-start shrink-0">
        <div>
          <h2 className="font-display text-[#FFED31] font-semibold text-lg leading-tight">
            {d.name}
          </h2>
          <div className="mt-2 flex gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="text-xs font-medium"
              style={{ backgroundColor: l.bg, color: l.color, borderColor: `${l.color}40` }}
            >
              {l.label} Debt
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-medium"
              style={{
                backgroundColor: "#F3F4F6",
                color: STRAT_COLOR[d.strategic],
                borderColor: `${STRAT_COLOR[d.strategic]}30`,
              }}
            >
              {d.strategic} Priority
            </Badge>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-white/5 border border-white/15 rounded-md text-white/50 cursor-pointer p-1.5 hover:text-white/90 hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 px-6 py-4 shrink-0">
        {[
          { label: "IT Spend", value: `$${d.itSpend}M`, color: BB.blue },
          { label: "Debt Interest", value: `${d.debtPct}%`, color: l.color },
          { label: "Debt Cost", value: `$${debtCost(d).toFixed(1)}M`, color: "#DC2626" },
        ].map((kpi) => (
          <Card key={kpi.label} className="py-0">
            <CardContent className="px-3 py-2.5 text-center">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide font-body">
                {kpi.label}
              </div>
              <div className="text-lg font-display font-bold mt-0.5" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-6 mt-4 shrink-0">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="dimensions" className="text-sm">Dimensions</TabsTrigger>
          <TabsTrigger value="tags" className="text-sm">Tags</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 min-h-0">
          <TabsContent value="overview" className="px-6 py-4 mt-0">
            {/* Debt Level */}
            <div className="mb-5">
              <div className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Tech Debt Level
              </div>
              <div className="flex gap-2 flex-wrap">
                {DEBT_LEVELS.map((dl) => (
                  <button
                    key={dl.score}
                    onClick={() => set("debt", dl.score)}
                    className="rounded-md px-3 py-1.5 text-sm font-medium font-display cursor-pointer transition-all duration-150"
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
            <div className="mb-5">
              <div className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Strategic Importance
              </div>
              <div className="flex gap-2">
                {STRATEGIC.map((s) => (
                  <button
                    key={s}
                    onClick={() => set("strategic", s as StrategicLevel)}
                    className="rounded-md px-3 py-1.5 text-sm font-medium font-display cursor-pointer transition-all duration-150"
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

            <Separator className="mb-5" />

            {/* Numeric Fields */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "itSpend" as const, label: "IT Spend ($M)" },
                { key: "debtPct" as const, label: "Debt Interest (%)" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <div className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    {label}
                  </div>
                  <Input
                    type="number"
                    value={d[key]}
                    onChange={(e) => set(key, Math.max(0, +e.target.value))}
                    className="h-9 text-sm font-body"
                    min={0}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="px-6 py-4 mt-0">
            <div className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Dimensions (1 = Low · 5 = High)
            </div>
            <div className="flex flex-col gap-5">
              {DIMS.map((dim) => {
                const s = d[dim.key];
                const c = dimColor(s);
                return (
                  <div key={dim.key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-display font-medium text-bby-dark">
                        {dim.icon} {dim.label}
                      </span>
                      <span className="text-xs text-muted-foreground font-body">{dim.desc}</span>
                    </div>
                    <div className="flex gap-2">
                      {([1, 2, 3, 4, 5] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => set(dim.key, n)}
                          className="flex-1 h-8 rounded-md text-sm font-semibold font-display cursor-pointer flex items-center justify-center transition-all duration-150"
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
          </TabsContent>

          <TabsContent value="tags" className="px-6 py-4 mt-0">
            {([
              { field: "strengths" as const, label: "Strengths", color: "#3A7D5C", bg: "#EAF4EE" },
              { field: "opportunities" as const, label: "Opportunities", color: "#C47B2B", bg: "#FBF1E3" },
            ]).map(({ field, label, color, bg }) => (
              <div key={field} className="mb-5">
                <div className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {label}
                </div>
                <div className="flex flex-col gap-1.5">
                  {d[field].map((t, i) => (
                    <div
                      key={i}
                      className="rounded-lg px-3 py-2 text-sm font-body flex justify-between items-center"
                      style={{ background: bg, color, border: `1px solid ${color}20` }}
                    >
                      {t}
                      <button
                        onClick={() => rmTag(field, i)}
                        className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
                        style={{ color }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => openTagDialog(field)}
                    className="border border-dashed border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-pointer text-center hover:border-muted-foreground transition-colors flex items-center justify-center gap-1.5 font-body"
                  >
                    <Plus size={14} /> Add {label === "Strengths" ? "Strength" : "Opportunity"}
                  </button>
                </div>
              </div>
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Save button */}
      <div className="px-6 py-4 border-t shrink-0">
        <Button
          onClick={() => { onSave(d); onClose(); }}
          className="w-full h-10 text-sm font-display font-semibold"
        >
          Save Changes
        </Button>
      </div>

      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-display">
              Add {tagField === "strengths" ? "Strength" : "Opportunity"}
            </DialogTitle>
          </DialogHeader>
          <Input
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
            placeholder={`Enter ${tagField === "strengths" ? "strength" : "opportunity"}...`}
            autoFocus
            className="font-body"
            onKeyDown={(e) => { if (e.key === "Enter") addTag(); }}
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
    </div>
  );
}
