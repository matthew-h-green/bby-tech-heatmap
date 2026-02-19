"use client";

import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";
import { DOMAINS, INFRA_SDS } from "@/lib/data";
import type { Domain, Subdomain, OpenState } from "@/types/heatmap";
import { debtCost } from "@/lib/scoring";

interface State {
  domains: Domain[];
  infraSds: Subdomain[];
  selected: Subdomain | null;
  openState: OpenState;
}

type Action =
  | { type: "SELECT"; sd: Subdomain | null }
  | { type: "TOGGLE"; id: string }
  | { type: "SAVE"; sd: Subdomain };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT":
      return { ...state, selected: action.sd };
    case "TOGGLE":
      return { ...state, openState: { ...state.openState, [action.id]: !state.openState[action.id] } };
    case "SAVE": {
      const u = action.sd;
      return {
        ...state,
        domains: state.domains.map((l1) => ({
          ...l1,
          subdomains: l1.subdomains.map((sd) => (sd.id === u.id ? u : sd)),
        })),
        infraSds: state.infraSds.map((sd) => (sd.id === u.id ? u : sd)),
        selected: u,
      };
    }
    default:
      return state;
  }
}

interface HeatmapContextType {
  domains: Domain[];
  infraSds: Subdomain[];
  selected: Subdomain | null;
  openState: OpenState;
  allSubdomains: Subdomain[];
  totalSpend: number;
  totalDebtCost: number;
  avgDebtScore: number;
  highCount: number;
  select: (sd: Subdomain | null) => void;
  toggle: (id: string) => void;
  save: (sd: Subdomain) => void;
}

const HeatmapContext = createContext<HeatmapContextType | null>(null);

const initialOpen: OpenState = {
  commerce: true,
  services: true,
  scm: true,
  data: true,
  store: false,
  corporate: false,
  infra: true,
};

export function HeatmapProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    domains: DOMAINS,
    infraSds: INFRA_SDS,
    selected: null,
    openState: initialOpen,
  });

  const allSubdomains = useMemo(
    () => [...state.domains.flatMap((d) => d.subdomains), ...state.infraSds],
    [state.domains, state.infraSds]
  );

  const totalSpend = useMemo(() => allSubdomains.reduce((s, d) => s + d.itSpend, 0), [allSubdomains]);
  const totalDebtCost = useMemo(() => allSubdomains.reduce((s, d) => s + debtCost(d), 0), [allSubdomains]);
  const avgDebtScore = useMemo(
    () => +(allSubdomains.reduce((s, d) => s + d.debt, 0) / allSubdomains.length).toFixed(1),
    [allSubdomains]
  );
  const highCount = useMemo(() => allSubdomains.filter((d) => d.debt >= 4).length, [allSubdomains]);

  const value = useMemo<HeatmapContextType>(
    () => ({
      ...state,
      allSubdomains,
      totalSpend,
      totalDebtCost,
      avgDebtScore,
      highCount,
      select: (sd) => dispatch({ type: "SELECT", sd }),
      toggle: (id) => dispatch({ type: "TOGGLE", id }),
      save: (sd) => dispatch({ type: "SAVE", sd }),
    }),
    [state, allSubdomains, totalSpend, totalDebtCost, avgDebtScore, highCount]
  );

  return <HeatmapContext.Provider value={value}>{children}</HeatmapContext.Provider>;
}

export function useHeatmap(): HeatmapContextType {
  const ctx = useContext(HeatmapContext);
  if (!ctx) throw new Error("useHeatmap must be used within HeatmapProvider");
  return ctx;
}
