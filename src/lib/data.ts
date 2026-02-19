import type { Domain, Subdomain } from "@/types/heatmap";

export const DOMAINS: Domain[] = [
  {
    id: "commerce",
    label: "Commerce & Digital",
    icon: "🛒",
    subdomains: [
      { id: "web", name: "Digital Commerce & BestBuy.com", debt: 4, strategic: "Critical", itSpend: 18, debtPct: 22, bizValue: 5, skillsObs: 3, talentConc: 3, vendorDep: 3, strengths: ["40% of revenue digital", "Strong app engagement"], opportunities: ["Platform modernisation", "Personalisation scalability"] },
      { id: "mktplace", name: "Marketplace Platform", debt: 5, strategic: "Critical", itSpend: 12, debtPct: 28, bizValue: 5, skillsObs: 4, talentConc: 4, vendorDep: 3, strengths: ["Canadian platform learnings"], opportunities: ["US relaunch architecture", "API-first 3rd-party integration"] },
      { id: "search", name: "Search & Merchandising", debt: 4, strategic: "High", itSpend: 8, debtPct: 20, bizValue: 4, skillsObs: 3, talentConc: 3, vendorDep: 4, strengths: ["CNET editorial integration"], opportunities: ["Real-time relevance tuning", "AI-driven merchandising"] },
      { id: "checkout", name: "Checkout & Payments", debt: 3, strategic: "High", itSpend: 7, debtPct: 15, bizValue: 4, skillsObs: 2, talentConc: 2, vendorDep: 3, strengths: ["Stable conversion baseline"], opportunities: ["Wallet / BNPL expansion", "Fraud model refresh"] },
      { id: "loyalty", name: "My Best Buy / Loyalty", debt: 3, strategic: "High", itSpend: 8, debtPct: 16, bizValue: 4, skillsObs: 2, talentConc: 2, vendorDep: 2, strengths: ["32M members, 90%+ sales penetration"], opportunities: ["Unified data model", "Real-time personalisation"] },
    ],
  },
  {
    id: "services",
    label: "Services & Geek Squad",
    icon: "🔧",
    subdomains: [
      { id: "gsplatform", name: "Geek Squad Field Platform", debt: 3, strategic: "Critical", itSpend: 14, debtPct: 14, bizValue: 5, skillsObs: 3, talentConc: 4, vendorDep: 2, strengths: ["$7.5B revenue / ~50% margin"], opportunities: ["Dispatch modernisation", "AI diagnostics"] },
      { id: "gsremote", name: "Remote Support & Virtual Agent", debt: 3, strategic: "High", itSpend: 8, debtPct: 13, bizValue: 4, skillsObs: 2, talentConc: 2, vendorDep: 3, strengths: ["Gen AI assistant via Google Cloud"], opportunities: ["Tooling consolidation", "Escalation intelligence"] },
      { id: "health", name: "Best Buy Health (Lively / Current Health)", debt: 4, strategic: "High", itSpend: 9, debtPct: 24, bizValue: 4, skillsObs: 4, talentConc: 4, vendorDep: 4, strengths: ["First-mover aging-in-place"], opportunities: ["Legacy health platform debt", "Geek Squad interoperability"] },
      { id: "membership", name: "Membership & Subscriptions", debt: 3, strategic: "High", itSpend: 6, debtPct: 15, bizValue: 3, skillsObs: 2, talentConc: 2, vendorDep: 2, strengths: ["Recurring revenue model"], opportunities: ["Entitlement system modernisation", "Churn analytics"] },
    ],
  },
  {
    id: "scm",
    label: "Supply Chain & Fulfillment",
    icon: "📦",
    subdomains: [
      { id: "inventory", name: "Inventory Management", debt: 3, strategic: "High", itSpend: 14, debtPct: 17, bizValue: 4, skillsObs: 3, talentConc: 2, vendorDep: 3, strengths: ["Localised inventory investments underway"], opportunities: ["Real-time demand sensing", "Tariff volatility response"] },
      { id: "fulfillment", name: "Order Fulfillment & Last Mile", debt: 4, strategic: "Critical", itSpend: 16, debtPct: 21, bizValue: 5, skillsObs: 3, talentConc: 3, vendorDep: 4, strengths: ["MEC / RDC automation live"], opportunities: ["Ship-from-store orchestration", "Cost-to-serve optimisation"] },
      { id: "wms", name: "Warehouse Management Systems", debt: 4, strategic: "High", itSpend: 10, debtPct: 20, bizValue: 3, skillsObs: 4, talentConc: 3, vendorDep: 5, strengths: ["Automated storage & retrieval"], opportunities: ["WMS modernisation", "WES integration gaps"] },
      { id: "vendor", name: "Vendor & Partner Integration", debt: 4, strategic: "Medium", itSpend: 7, debtPct: 19, bizValue: 3, skillsObs: 3, talentConc: 2, vendorDep: 5, strengths: ["Strong OEM relationships"], opportunities: ["EDI → API migration", "Vendor portal modernisation"] },
    ],
  },
  {
    id: "data",
    label: "Data & AI",
    icon: "📊",
    subdomains: [
      { id: "dataplatform", name: "Data Platform & Lakehouse", debt: 4, strategic: "Critical", itSpend: 13, debtPct: 20, bizValue: 5, skillsObs: 4, talentConc: 4, vendorDep: 3, strengths: ["Forrester 2024 Tech Strategy Award"], opportunities: ["Unified lakehouse architecture", "Retail media measurement"] },
      { id: "ai", name: "AI & Personalisation Engine", debt: 4, strategic: "Critical", itSpend: 10, debtPct: 22, bizValue: 5, skillsObs: 5, talentConc: 4, vendorDep: 3, strengths: ["Gen AI virtual assistant", "Google Cloud partnership"], opportunities: ["Fragmented ML tooling", "Feature store maturity"] },
      { id: "retailmedia", name: "Retail Media (Best Buy Ads)", debt: 3, strategic: "High", itSpend: 7, debtPct: 14, bizValue: 4, skillsObs: 3, talentConc: 3, vendorDep: 3, strengths: ["High-margin revenue stream"], opportunities: ["Ad tech independence", "Measurement infrastructure"] },
      { id: "analytics", name: "Customer & Ops Analytics", debt: 3, strategic: "High", itSpend: 6, debtPct: 13, bizValue: 4, skillsObs: 3, talentConc: 3, vendorDep: 2, strengths: ["20%+ reduction in cost-per-contact"], opportunities: ["Unified customer 360", "Self-serve analytics maturity"] },
    ],
  },
  {
    id: "store",
    label: "Store Operations",
    icon: "🏪",
    subdomains: [
      { id: "pos", name: "POS & In-Store Systems", debt: 5, strategic: "High", itSpend: 11, debtPct: 26, bizValue: 3, skillsObs: 5, talentConc: 3, vendorDep: 4, strengths: ["~1,000 store footprint"], opportunities: ["POS modernisation", "Experience store tech enablement"] },
      { id: "workforce", name: "Workforce & Labour Management", debt: 2, strategic: "Medium", itSpend: 5, debtPct: 10, bizValue: 2, skillsObs: 2, talentConc: 1, vendorDep: 2, strengths: ["30K+ AI-trained associates"], opportunities: ["Scheduling optimisation", "Skills tracking"] },
    ],
  },
  {
    id: "corporate",
    label: "Corporate & Finance",
    icon: "🏢",
    subdomains: [
      { id: "erp", name: "ERP & Finance Systems", debt: 2, strategic: "Medium", itSpend: 9, debtPct: 9, bizValue: 2, skillsObs: 2, talentConc: 2, vendorDep: 3, strengths: ["Stable core financials"], opportunities: ["FP&A modernisation", "Seasonal demand modelling"] },
      { id: "hr", name: "HR & Workforce Systems", debt: 2, strategic: "Low", itSpend: 4, debtPct: 8, bizValue: 1, skillsObs: 2, talentConc: 1, vendorDep: 2, strengths: ["Standard platforms"], opportunities: ["Talent analytics", "Learning platform consolidation"] },
    ],
  },
];

export const INFRA_SDS: Subdomain[] = [
  { id: "cloud", name: "Cloud & Platform Engineering", debt: 3, strategic: "Critical", itSpend: 15, debtPct: 15, bizValue: 5, skillsObs: 3, talentConc: 3, vendorDep: 3, strengths: ["Cloud migration in progress"], opportunities: ["Multi-cloud governance", "FinOps maturity"] },
  { id: "security", name: "Cybersecurity & Identity", debt: 4, strategic: "Critical", itSpend: 10, debtPct: 20, bizValue: 4, skillsObs: 4, talentConc: 4, vendorDep: 3, strengths: ["PCI / data handling compliance"], opportunities: ["Zero-trust architecture", "In-home data risk (Geek Squad)"] },
  { id: "network", name: "Network & Store Connectivity", debt: 4, strategic: "High", itSpend: 8, debtPct: 19, bizValue: 3, skillsObs: 4, talentConc: 3, vendorDep: 4, strengths: ["Wide physical network"], opportunities: ["SD-WAN rollout", "Edge computing readiness"] },
  { id: "devops", name: "DevOps & Engineering Platform", debt: 3, strategic: "High", itSpend: 7, debtPct: 14, bizValue: 4, skillsObs: 3, talentConc: 3, vendorDep: 2, strengths: ["CI/CD adoption improving"], opportunities: ["Platform engineering maturity", "Developer experience"] },
];
