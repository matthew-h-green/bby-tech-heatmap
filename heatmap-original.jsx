import { useState } from "react";

const BB = { blue:"#0045BE", blueLight:"#E8EFFE", blueMid:"#C2D4F8", yellow:"#FFED31", yellowLight:"#FFFBE6", dark:"#1C252C", white:"#FFFFFF", bg:"#F4F5F7", mid:"#E8EAED", muted:"#6B7280" };

const DEBT_LEVELS = [
  { label:"Minimal",   score:1, color:"#6B7280", bg:"#F3F4F6" },
  { label:"Low",       score:2, color:"#2563A8", bg:"#EBF2FB" },
  { label:"Moderate",  score:3, color:"#1D6FA0", bg:"#E5F2F8" },
  { label:"High",      score:4, color:"#B45309", bg:"#FBF3E8" },
  { label:"Very High", score:5, color:"#9B2020", bg:"#F9EDED" },
];

const DIMS = [
  { key:"bizValue",   label:"Business Value Unlock", icon:"💼", desc:"Opportunity unlocked by resolving debt" },
  { key:"skillsObs",  label:"Skills Obsolescence",   icon:"📚", desc:"Risk that current skills become hard to hire or retain" },
  { key:"talentConc", label:"Talent Concentration",  icon:"👤", desc:"Key person / single point of failure risk" },
  { key:"vendorDep",  label:"Vendor Dependency",     icon:"🔗", desc:"Lock-in or reliance on non-strategic vendors" },
];

const STRATEGIC = ["Low","Medium","High","Critical"];
const STRAT_COLOR = { Low:"#9CA3AF", Medium:"#4B5563", High:"#0045BE", Critical:"#1C252C" };
const STRAT_RANK  = { Low:1, Medium:2, High:3, Critical:4 };

const getLevel = s => DEBT_LEVELS.find(d => d.score === s) || DEBT_LEVELS[0];
const dimColor  = s => s <= 2 ? "#6B7280" : s === 3 ? "#2563A8" : s <= 4 ? "#B45309" : "#9B2020";

const DOMAINS = [
  { id:"commerce", label:"Commerce & Digital", icon:"🛒", subdomains:[
    { id:"web",        name:"Digital Commerce & BestBuy.com",           debt:4, strategic:"Critical", itSpend:18, debtPct:22, bizValue:5, skillsObs:3, talentConc:3, vendorDep:3, strengths:["40% of revenue digital","Strong app engagement"], opportunities:["Platform modernisation","Personalisation scalability"] },
    { id:"mktplace",   name:"Marketplace Platform",                     debt:5, strategic:"Critical", itSpend:12, debtPct:28, bizValue:5, skillsObs:4, talentConc:4, vendorDep:3, strengths:["Canadian platform learnings"], opportunities:["US relaunch architecture","API-first 3rd-party integration"] },
    { id:"search",     name:"Search & Merchandising",                   debt:4, strategic:"High",     itSpend:8,  debtPct:20, bizValue:4, skillsObs:3, talentConc:3, vendorDep:4, strengths:["CNET editorial integration"], opportunities:["Real-time relevance tuning","AI-driven merchandising"] },
    { id:"checkout",   name:"Checkout & Payments",                      debt:3, strategic:"High",     itSpend:7,  debtPct:15, bizValue:4, skillsObs:2, talentConc:2, vendorDep:3, strengths:["Stable conversion baseline"], opportunities:["Wallet / BNPL expansion","Fraud model refresh"] },
    { id:"loyalty",    name:"My Best Buy / Loyalty",                    debt:3, strategic:"High",     itSpend:8,  debtPct:16, bizValue:4, skillsObs:2, talentConc:2, vendorDep:2, strengths:["32M members, 90%+ sales penetration"], opportunities:["Unified data model","Real-time personalisation"] },
  ]},
  { id:"services", label:"Services & Geek Squad", icon:"🔧", subdomains:[
    { id:"gsplatform", name:"Geek Squad Field Platform",                debt:3, strategic:"Critical", itSpend:14, debtPct:14, bizValue:5, skillsObs:3, talentConc:4, vendorDep:2, strengths:["$7.5B revenue / ~50% margin"], opportunities:["Dispatch modernisation","AI diagnostics"] },
    { id:"gsremote",   name:"Remote Support & Virtual Agent",           debt:3, strategic:"High",     itSpend:8,  debtPct:13, bizValue:4, skillsObs:2, talentConc:2, vendorDep:3, strengths:["Gen AI assistant via Google Cloud"], opportunities:["Tooling consolidation","Escalation intelligence"] },
    { id:"health",     name:"Best Buy Health (Lively / Current Health)",debt:4, strategic:"High",     itSpend:9,  debtPct:24, bizValue:4, skillsObs:4, talentConc:4, vendorDep:4, strengths:["First-mover aging-in-place"], opportunities:["Legacy health platform debt","Geek Squad interoperability"] },
    { id:"membership", name:"Membership & Subscriptions",               debt:3, strategic:"High",     itSpend:6,  debtPct:15, bizValue:3, skillsObs:2, talentConc:2, vendorDep:2, strengths:["Recurring revenue model"], opportunities:["Entitlement system modernisation","Churn analytics"] },
  ]},
  { id:"scm", label:"Supply Chain & Fulfillment", icon:"📦", subdomains:[
    { id:"inventory",  name:"Inventory Management",                     debt:3, strategic:"High",     itSpend:14, debtPct:17, bizValue:4, skillsObs:3, talentConc:2, vendorDep:3, strengths:["Localised inventory investments underway"], opportunities:["Real-time demand sensing","Tariff volatility response"] },
    { id:"fulfillment",name:"Order Fulfillment & Last Mile",            debt:4, strategic:"Critical", itSpend:16, debtPct:21, bizValue:5, skillsObs:3, talentConc:3, vendorDep:4, strengths:["MEC / RDC automation live"], opportunities:["Ship-from-store orchestration","Cost-to-serve optimisation"] },
    { id:"wms",        name:"Warehouse Management Systems",             debt:4, strategic:"High",     itSpend:10, debtPct:20, bizValue:3, skillsObs:4, talentConc:3, vendorDep:5, strengths:["Automated storage & retrieval"], opportunities:["WMS modernisation","WES integration gaps"] },
    { id:"vendor",     name:"Vendor & Partner Integration",             debt:4, strategic:"Medium",   itSpend:7,  debtPct:19, bizValue:3, skillsObs:3, talentConc:2, vendorDep:5, strengths:["Strong OEM relationships"], opportunities:["EDI → API migration","Vendor portal modernisation"] },
  ]},
  { id:"data", label:"Data & AI", icon:"📊", subdomains:[
    { id:"dataplatform",name:"Data Platform & Lakehouse",               debt:4, strategic:"Critical", itSpend:13, debtPct:20, bizValue:5, skillsObs:4, talentConc:4, vendorDep:3, strengths:["Forrester 2024 Tech Strategy Award"], opportunities:["Unified lakehouse architecture","Retail media measurement"] },
    { id:"ai",          name:"AI & Personalisation Engine",             debt:4, strategic:"Critical", itSpend:10, debtPct:22, bizValue:5, skillsObs:5, talentConc:4, vendorDep:3, strengths:["Gen AI virtual assistant","Google Cloud partnership"], opportunities:["Fragmented ML tooling","Feature store maturity"] },
    { id:"retailmedia", name:"Retail Media (Best Buy Ads)",             debt:3, strategic:"High",     itSpend:7,  debtPct:14, bizValue:4, skillsObs:3, talentConc:3, vendorDep:3, strengths:["High-margin revenue stream"], opportunities:["Ad tech independence","Measurement infrastructure"] },
    { id:"analytics",   name:"Customer & Ops Analytics",                debt:3, strategic:"High",     itSpend:6,  debtPct:13, bizValue:4, skillsObs:3, talentConc:3, vendorDep:2, strengths:["20%+ reduction in cost-per-contact"], opportunities:["Unified customer 360","Self-serve analytics maturity"] },
  ]},
  { id:"store", label:"Store Operations", icon:"🏪", subdomains:[
    { id:"pos",        name:"POS & In-Store Systems",                   debt:5, strategic:"High",     itSpend:11, debtPct:26, bizValue:3, skillsObs:5, talentConc:3, vendorDep:4, strengths:["~1,000 store footprint"], opportunities:["POS modernisation","Experience store tech enablement"] },
    { id:"workforce",  name:"Workforce & Labour Management",            debt:2, strategic:"Medium",   itSpend:5,  debtPct:10, bizValue:2, skillsObs:2, talentConc:1, vendorDep:2, strengths:["30K+ AI-trained associates"], opportunities:["Scheduling optimisation","Skills tracking"] },
  ]},
  { id:"corporate", label:"Corporate & Finance", icon:"🏢", subdomains:[
    { id:"erp",        name:"ERP & Finance Systems",                    debt:2, strategic:"Medium",   itSpend:9,  debtPct:9,  bizValue:2, skillsObs:2, talentConc:2, vendorDep:3, strengths:["Stable core financials"], opportunities:["FP&A modernisation","Seasonal demand modelling"] },
    { id:"hr",         name:"HR & Workforce Systems",                   debt:2, strategic:"Low",      itSpend:4,  debtPct:8,  bizValue:1, skillsObs:2, talentConc:1, vendorDep:2, strengths:["Standard platforms"], opportunities:["Talent analytics","Learning platform consolidation"] },
  ]},
];

const INFRA_SDS = [
  { id:"cloud",    name:"Cloud & Platform Engineering", debt:3, strategic:"Critical", itSpend:15, debtPct:15, bizValue:5, skillsObs:3, talentConc:3, vendorDep:3, strengths:["Cloud migration in progress"], opportunities:["Multi-cloud governance","FinOps maturity"] },
  { id:"security", name:"Cybersecurity & Identity",     debt:4, strategic:"Critical", itSpend:10, debtPct:20, bizValue:4, skillsObs:4, talentConc:4, vendorDep:3, strengths:["PCI / data handling compliance"], opportunities:["Zero-trust architecture","In-home data risk (Geek Squad)"] },
  { id:"network",  name:"Network & Store Connectivity", debt:4, strategic:"High",     itSpend:8,  debtPct:19, bizValue:3, skillsObs:4, talentConc:3, vendorDep:4, strengths:["Wide physical network"], opportunities:["SD-WAN rollout","Edge computing readiness"] },
  { id:"devops",   name:"DevOps & Engineering Platform",debt:3, strategic:"High",     itSpend:7,  debtPct:14, bizValue:4, skillsObs:3, talentConc:3, vendorDep:2, strengths:["CI/CD adoption improving"], opportunities:["Platform engineering maturity","Developer experience"] },
];

// ── score dots ────────────────────────────────────────────────────
function ScoreDots({ score, color }) {
  return (
    <div style={{ display:"flex", gap:2, alignItems:"center" }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width:5, height:5, borderRadius:"50%", background: i <= score ? color : "#E5E7EB", transition:"background 0.2s" }} />
      ))}
    </div>
  );
}

// ── dim icon row ──────────────────────────────────────────────────
function DimRow({ sd, dark }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px 8px", marginTop:6, paddingTop:6, borderTop: dark ? "1px solid rgba(255,255,255,0.15)" : `1px solid ${BB.mid}` }}>
      {DIMS.map(d => {
        const s = sd[d.key];
        const c = dark ? (s <= 2 ? "#86efac" : s === 3 ? "#c4b5fd" : s <= 4 ? "#fcd34d" : "#fca5a5") : dimColor(s);
        return (
          <div key={d.key} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:9 }}>{d.icon}</span>
            <ScoreDots score={s} color={c} />
          </div>
        );
      })}
    </div>
  );
}

// ── heat cell ─────────────────────────────────────────────────────
function HeatCell({ sd, onClick, active }) {
  const l = getLevel(sd.debt);
  const opacity = [0.07, 0.12, 0.18, 0.25, 0.33][sd.debt - 1];
  const hex = Math.round(opacity * 255).toString(16).padStart(2,"0");
  return (
    <div onClick={() => onClick(sd)} style={{
      background: active ? l.color : `${l.color}${hex}`,
      border: active ? `2px solid ${l.color}` : `1px solid ${l.color}35`,
      borderRadius:6, padding:"9px 10px", cursor:"pointer",
      transition:"all 0.15s",
      boxShadow: active ? `0 0 0 3px ${l.color}25` : "none",
    }}>
      <div style={{ fontWeight:700, fontSize:11, color: active ? BB.white : BB.dark, marginBottom:4, lineHeight:1.3 }}>{sd.name}</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:9, fontWeight:800, color: active ? "rgba(255,255,255,0.9)" : l.color }}>{l.label}</span>
        <span style={{ fontSize:9, color: active ? "rgba(255,255,255,0.65)" : BB.muted }}>${sd.itSpend}M · {sd.debtPct}%</span>
      </div>
      <DimRow sd={sd} dark={active} />
    </div>
  );
}

// ── detail panel ─────────────────────────────────────────────────
function DetailPanel({ sd, onClose, onSave }) {
  const [d, setD] = useState({...sd});
  const l = getLevel(d.debt);
  const set = (k,v) => setD(p=>({...p,[k]:v}));
  const addTag = f => { const v=prompt(`Add to ${f}:`); if(v?.trim()) set(f,[...d[f],v.trim()]); };
  const rmTag  = (f,i) => set(f, d[f].filter((_,j)=>j!==i));
  return (
    <div style={{ background:BB.white, borderRadius:8, overflow:"hidden", border:`1px solid ${BB.mid}`, boxShadow:"0 8px 24px rgba(0,0,0,0.12)" }}>
      <div style={{ background:BB.dark, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ color:BB.yellow, fontWeight:800, fontSize:13, lineHeight:1.3 }}>{d.name}</div>
          <div style={{ marginTop:4, display:"flex", gap:5, flexWrap:"wrap" }}>
            <span style={{ background:l.bg, color:l.color, border:`1px solid ${l.color}40`, borderRadius:4, padding:"1px 6px", fontSize:9, fontWeight:700 }}>{l.label} Debt</span>
            <span style={{ background:"#F3F4F6", color:STRAT_COLOR[d.strategic], border:`1px solid ${STRAT_COLOR[d.strategic]}30`, borderRadius:4, padding:"1px 6px", fontSize:9, fontWeight:700 }}>{d.strategic}</span>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.2)", borderRadius:4, color:"rgba(255,255,255,0.6)", cursor:"pointer", padding:"3px 8px", fontSize:12 }}>✕</button>
      </div>

      <div style={{ padding:14, maxHeight:"72vh", overflowY:"auto" }}>
        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[["IT Spend","$"+d.itSpend+"M",BB.blue],["Debt Interest",d.debtPct+"%",l.color],["Debt Cost","$"+(d.itSpend*d.debtPct/100).toFixed(1)+"M","#A63D2F"]].map(([lb,val,c])=>(
            <div key={lb} style={{ background:BB.bg, borderRadius:6, padding:"9px 10px", textAlign:"center", border:`1px solid ${BB.mid}` }}>
              <div style={{ fontSize:8, color:BB.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:0.4 }}>{lb}</div>
              <div style={{ fontSize:16, fontWeight:900, color:c, marginTop:3 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Debt level */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:9, fontWeight:800, color:BB.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Tech Debt Level</div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {DEBT_LEVELS.map(dl=>(
              <div key={dl.score} onClick={()=>set("debt",dl.score)} style={{ background:d.debt===dl.score?dl.color:dl.bg, color:d.debt===dl.score?"#fff":dl.color, border:`1px solid ${dl.color}50`, borderRadius:4, padding:"4px 10px", fontSize:10, fontWeight:700, cursor:"pointer", transition:"all 0.15s" }}>{dl.label}</div>
            ))}
          </div>
        </div>

        {/* Strategic */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:800, color:BB.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Strategic Importance</div>
          <div style={{ display:"flex", gap:5 }}>
            {STRATEGIC.map(s=>(
              <div key={s} onClick={()=>set("strategic",s)} style={{ background:d.strategic===s?BB.dark:"#F3F4F6", color:d.strategic===s?BB.yellow:BB.muted, borderRadius:4, padding:"4px 10px", fontSize:10, fontWeight:700, cursor:"pointer", transition:"all 0.15s" }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Numeric fields */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
          {[["itSpend","IT Spend ($M)"],["debtPct","Debt Interest (%)"]].map(([k,lb])=>(
            <div key={k}>
              <div style={{ fontSize:9, fontWeight:800, color:BB.muted, textTransform:"uppercase", letterSpacing:0.4, marginBottom:4 }}>{lb}</div>
              <input type="number" value={d[k]} onChange={e=>set(k,+e.target.value)} style={{ width:"100%", border:`1px solid ${BB.mid}`, borderRadius:5, padding:"6px 8px", fontSize:12, boxSizing:"border-box", color:BB.dark }} />
            </div>
          ))}
        </div>

        {/* Dimension scores */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:800, color:BB.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Dimensions (1 = Low · 5 = High)</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {DIMS.map(dim => {
              const s = d[dim.key];
              const c = dimColor(s);
              return (
                <div key={dim.key}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:BB.dark }}>{dim.icon} {dim.label}</span>
                    <span style={{ fontSize:9, color:BB.muted }}>{dim.desc}</span>
                  </div>
                  <div style={{ display:"flex", gap:5 }}>
                    {[1,2,3,4,5].map(n=>(
                      <div key={n} onClick={()=>set(dim.key,n)} style={{ flex:1, height:24, borderRadius:4, background:n<=s?c:`${c}20`, border:`1px solid ${c}40`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:n<=s?"#fff":c, transition:"all 0.15s" }}>{n}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        {[["strengths","Strengths","#3A7D5C","#EAF4EE"],["opportunities","Opportunities","#C47B2B","#FBF1E3"]].map(([f,lb,c,bg])=>(
          <div key={f} style={{ marginBottom:12 }}>
            <div style={{ fontSize:9, fontWeight:800, color:BB.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>{lb}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              {d[f].map((t,i)=>(
                <div key={i} style={{ background:bg, border:`1px solid ${c}25`, borderRadius:5, padding:"5px 9px", fontSize:10, color:c, fontWeight:600, display:"flex", justifyContent:"space-between" }}>
                  {t}<span onClick={()=>rmTag(f,i)} style={{ cursor:"pointer", opacity:0.45 }}>×</span>
                </div>
              ))}
              <div onClick={()=>addTag(f)} style={{ border:`1px dashed ${BB.mid}`, borderRadius:5, padding:"5px 9px", fontSize:10, color:BB.muted, cursor:"pointer", textAlign:"center" }}>+ Add</div>
            </div>
          </div>
        ))}

        <button onClick={()=>{ onSave(d); onClose(); }} style={{ width:"100%", background:BB.blue, color:"#fff", border:"none", borderRadius:6, padding:"10px", fontWeight:800, fontSize:12, cursor:"pointer", marginTop:4 }}>Save Changes</button>
      </div>
    </div>
  );
}

// ── L1 block ──────────────────────────────────────────────────────
function L1Block({ domain, activeId, onSelect, open, onToggle }) {
  const peak  = Math.max(...domain.subdomains.map(d=>d.debt));
  const pl    = getLevel(peak);
  const spend = domain.subdomains.reduce((s,d)=>s+d.itSpend,0);
  const cost  = domain.subdomains.reduce((s,d)=>s+(d.itSpend*d.debtPct/100),0);
  const hdrOp = [0.04,0.07,0.11,0.15,0.2][peak-1];
  const hdrHex= Math.round(hdrOp*255).toString(16).padStart(2,"0");
  return (
    <div style={{ borderRadius:8, overflow:"hidden", border:`1px solid ${pl.color}35`, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
      <div onClick={onToggle} style={{ background:`${pl.color}${hdrHex}`, borderBottom:`1px solid ${pl.color}25`, padding:"10px 13px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:14 }}>{domain.icon}</span>
          <div>
            <div style={{ color:BB.dark, fontWeight:800, fontSize:12 }}>{domain.label}</div>
            <div style={{ color:BB.muted, fontSize:9, marginTop:1 }}>{domain.subdomains.length} sub-domains · ${spend}M · ${cost.toFixed(1)}M debt cost</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ background:pl.bg, color:pl.color, border:`1px solid ${pl.color}40`, borderRadius:4, padding:"2px 8px", fontSize:9, fontWeight:700 }}>Peak: {pl.label}</span>
          <span style={{ color:BB.muted, fontSize:11, display:"inline-block", transform:open?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.2s" }}>▶</span>
        </div>
      </div>
      {!open && (
        <div style={{ padding:"7px 12px", display:"flex", gap:5, flexWrap:"wrap", background:BB.white }}>
          {domain.subdomains.map(sd=>{ const l=getLevel(sd.debt); return <span key={sd.id} onClick={()=>onSelect(sd)} style={{ background:l.bg, color:l.color, border:`1px solid ${l.color}35`, borderRadius:4, padding:"2px 7px", fontSize:9, fontWeight:700, cursor:"pointer" }}>{sd.name}</span>; })}
        </div>
      )}
      {open && (
        <div style={{ padding:10, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:7, background:BB.white }}>
          {domain.subdomains.map(sd=><HeatCell key={sd.id} sd={sd} onClick={onSelect} active={activeId===sd.id} />)}
        </div>
      )}
    </div>
  );
}

// ── infra foundation ──────────────────────────────────────────────
function InfraLayer({ sds, activeId, onSelect, open, onToggle }) {
  const spend = sds.reduce((s,d)=>s+d.itSpend,0);
  const cost  = sds.reduce((s,d)=>s+(d.itSpend*d.debtPct/100),0);
  return (
    <div style={{ borderRadius:8, overflow:"hidden", border:`2px solid ${BB.blue}40`, boxShadow:"0 2px 8px rgba(0,69,190,0.08)" }}>
      <div onClick={onToggle} style={{ background:BB.blueLight, borderBottom:`1px solid ${BB.blueMid}`, padding:"10px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:14 }}>⚙️</span>
          <div>
            <div style={{ color:BB.blue, fontWeight:800, fontSize:12 }}>ENTERPRISE TECHNOLOGY & INFRASTRUCTURE</div>
            <div style={{ color:BB.muted, fontSize:9, marginTop:1 }}>Foundation layer — enables / constrains every domain above · ${spend}M · ${cost.toFixed(1)}M debt cost</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ background:"#FBF1E3", color:"#C47B2B", border:"1px solid #C47B2B40", borderRadius:4, padding:"2px 8px", fontSize:9, fontWeight:700 }}>Peak: High</span>
          <span style={{ color:BB.muted, fontSize:11, display:"inline-block", transform:open?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.2s" }}>▶</span>
        </div>
      </div>
      {!open && (
        <div style={{ padding:"7px 12px", display:"flex", gap:5, flexWrap:"wrap", background:BB.white }}>
          {sds.map(sd=>{ const l=getLevel(sd.debt); return <span key={sd.id} onClick={e=>{e.stopPropagation();onSelect(sd);}} style={{ background:l.bg, color:l.color, border:`1px solid ${l.color}35`, borderRadius:4, padding:"2px 7px", fontSize:9, fontWeight:700, cursor:"pointer" }}>{sd.name}</span>; })}
        </div>
      )}
      {open && (
        <div style={{ padding:10, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:7, background:BB.white }}>
          {sds.map(sd=><HeatCell key={sd.id} sd={sd} onClick={onSelect} active={activeId===sd.id} />)}
        </div>
      )}
    </div>
  );
}

// ── summary panels ────────────────────────────────────────────────
function Quadrant({ allSDs, onDotClick }) {
  const bucket = sd => {
    const highDebt  = sd.debt >= 4;
    const highStrat = sd.strategic === "High" || sd.strategic === "Critical";
    if  (highDebt && highStrat)  return "prioritise";
    if  (highDebt && !highStrat) return "monitor";
    if  (!highDebt && highStrat) return "sustain";
    return "maintain";
  };
  const quadrants = [
            { id:"prioritise", label:"Prioritise Now",  sub:"High debt · High strategic value",   bg:"#FBF3E8", border:"#B45309", labelColor:"#7A3606", col:2, row:1 },
    { id:"monitor",    label:"Monitor",          sub:"High debt · Lower strategic impact", bg:"#F9EDED", border:"#9B2020", labelColor:"#6B1515", col:1, row:1 },
    { id:"sustain",    label:"Sustain & Invest", sub:"Low debt · High strategic value",    bg:BB.blueLight, border:BB.blue, labelColor:BB.blue,  col:2, row:2 },
    { id:"maintain",   label:"Maintain",         sub:"Low debt · Lower strategic impact",  bg:BB.bg,     border:BB.mid,    labelColor:BB.muted,  col:1, row:2 },
  ];
  const grouped = {};
  quadrants.forEach(q=>{ grouped[q.id]=[]; });
  allSDs.forEach(sd=>grouped[bucket(sd)].push(sd));
  return (
    <div>
      <div style={{ fontWeight:800, fontSize:13, color:BB.dark, marginBottom:2 }}>Debt Severity vs Strategic Importance</div>
      <div style={{ fontSize:10, color:BB.muted, marginBottom:12 }}>High debt = score ≥4 · High strategic = High or Critical · Click any domain to inspect</div>
      <div style={{ display:"grid", gridTemplateColumns:"64px 1fr 1fr", gridTemplateRows:"20px 1fr 1fr 20px", gap:0 }}>
        <div style={{ gridColumn:"1/2", gridRow:"1/2" }} />
        <div style={{ gridColumn:"2/4", gridRow:"1/2", textAlign:"center", fontSize:9, fontWeight:700, color:BB.muted, textTransform:"uppercase", letterSpacing:0.4 }}>← Strategic Importance →</div>
        <div style={{ gridColumn:"1/2", gridRow:"2/4", display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:8 }}>
          <div style={{ fontSize:9, fontWeight:700, color:BB.muted, textTransform:"uppercase", letterSpacing:0.4, writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>← Debt Severity →</div>
        </div>
        {quadrants.map(q=>(
          <div key={q.id} style={{ gridColumn:`${q.col+1}/${q.col+2}`, gridRow:`${q.row+1}/${q.row+2}`, background:q.bg, border:`1px solid ${q.border}30`, padding:"10px 12px", minHeight:130 }}>
            <div style={{ fontSize:11, fontWeight:800, color:q.labelColor, marginBottom:2 }}>{q.label}</div>
            <div style={{ fontSize:9, color:BB.muted, marginBottom:8, paddingBottom:6, borderBottom:`1px solid ${q.border}20` }}>{q.sub}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {grouped[q.id].length===0 && <div style={{ fontSize:9, color:"#ccc", fontStyle:"italic" }}>No domains</div>}
              {grouped[q.id].map(sd=>{ const l=getLevel(sd.debt); return (
                <div key={sd.id} onClick={()=>onDotClick(sd)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(255,255,255,0.8)", border:`1px solid ${l.color}30`, borderLeft:`3px solid ${l.color}`, borderRadius:4, padding:"4px 7px", cursor:"pointer", gap:6 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:BB.dark, flex:1, lineHeight:1.3 }}>{sd.name}</span>
                  <span style={{ fontSize:9, fontWeight:700, color:l.color, whiteSpace:"nowrap" }}>{l.label}</span>
                </div>
              );})}
            </div>
          </div>
        ))}
        <div style={{ gridColumn:"1/2", gridRow:"4/5" }} />
        <div style={{ gridColumn:"2/3", gridRow:"4/5", textAlign:"center", fontSize:9, fontWeight:700, color:BB.muted, paddingTop:4 }}>Low / Medium</div>
        <div style={{ gridColumn:"3/4", gridRow:"4/5", textAlign:"center", fontSize:9, fontWeight:700, color:BB.muted, paddingTop:4 }}>High / Critical</div>
      </div>
    </div>
  );
}

function L1Bars({ domains, infraSds }) {
  const groups = [...domains.map(d=>({ label:d.label, icon:d.icon, sds:d.subdomains })), { label:"Infrastructure", icon:"⚙️", sds:infraSds }];
  const maxCost = Math.max(...groups.map(g=>g.sds.reduce((s,d)=>s+(d.itSpend*d.debtPct/100),0)));
  return (
    <div>
      <div style={{ fontWeight:800, fontSize:13, color:BB.dark, marginBottom:4 }}>Debt Cost by Domain</div>
      <div style={{ fontSize:10, color:BB.muted, marginBottom:12 }}>Estimated annual debt interest cost per L1 domain</div>
      {groups.map(g=>{
        const cost=g.sds.reduce((s,d)=>s+(d.itSpend*d.debtPct/100),0);
        const spend=g.sds.reduce((s,d)=>s+d.itSpend,0);
        const peak=Math.max(...g.sds.map(d=>d.debt));
        const pl=getLevel(peak);
        return (
          <div key={g.label} style={{ marginBottom:9 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontSize:11, fontWeight:700, color:BB.dark }}>{g.icon} {g.label}</span>
              <span style={{ fontSize:11, fontWeight:800, color:pl.color }}>${cost.toFixed(1)}M <span style={{ color:BB.muted, fontWeight:400 }}>/ ${spend}M spend</span></span>
            </div>
            <div style={{ background:BB.mid, borderRadius:3, height:10, overflow:"hidden" }}>
              <div style={{ width:`${Math.round((cost/maxCost)*100)}%`, background:pl.color, height:"100%", borderRadius:3 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopFive({ allSDs, onSelect }) {
  const scored = allSDs.map(sd=>({ ...sd, priority: sd.debt * STRAT_RANK[sd.strategic] * (sd.debtPct/10) }))
    .sort((a,b)=>b.priority-a.priority).slice(0,5);
  return (
    <div>
      <div style={{ fontWeight:800, fontSize:13, color:BB.dark, marginBottom:4 }}>Top 5 Priority Domains</div>
      <div style={{ fontSize:10, color:BB.muted, marginBottom:10 }}>Ranked by debt × strategic importance × interest rate</div>
      {scored.map((sd,i)=>{ const l=getLevel(sd.debt); return (
        <div key={sd.id} onClick={()=>onSelect(sd)} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 11px", marginBottom:6, background:BB.white, borderRadius:6, border:`1px solid ${BB.mid}`, cursor:"pointer", borderLeft:`4px solid ${l.color}` }}>
          <div style={{ fontWeight:900, fontSize:18, color:BB.mid, width:20, flexShrink:0, lineHeight:1 }}>{i+1}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:11, color:BB.dark }}>{sd.name}</div>
            <div style={{ fontSize:9, color:BB.muted, marginTop:2, marginBottom:5 }}>{sd.opportunities[0]}</div>
            <div style={{ display:"flex", gap:8 }}>
              {DIMS.map(dim=>{ const s=sd[dim.key]; const c=dimColor(s); return (
                <div key={dim.key} style={{ display:"flex", alignItems:"center", gap:3 }}>
                  <span style={{ fontSize:9 }}>{dim.icon}</span>
                  <ScoreDots score={s} color={c} />
                </div>
              );})}
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <span style={{ background:l.bg, color:l.color, border:`1px solid ${l.color}40`, borderRadius:4, padding:"1px 6px", fontSize:9, fontWeight:700 }}>{l.label}</span>
            <div style={{ fontSize:10, fontWeight:800, color:"#A63D2F", marginTop:3 }}>${(sd.itSpend*sd.debtPct/100).toFixed(1)}M</div>
          </div>
        </div>
      );})}
    </div>
  );
}

function Waterfall({ allSDs }) {
  const sorted = allSDs.slice().sort((a,b)=>(b.itSpend*b.debtPct/100)-(a.itSpend*a.debtPct/100));
  const total  = sorted.reduce((s,d)=>s+(d.itSpend*d.debtPct/100),0);
  const maxVal = sorted[0].itSpend*sorted[0].debtPct/100;
  return (
    <div>
      <div style={{ fontWeight:800, fontSize:13, color:BB.dark, marginBottom:4 }}>Debt Interest Cost Waterfall</div>
      <div style={{ fontSize:10, color:BB.muted, marginBottom:10 }}>Domain debt costs ranked — portfolio total <strong>${total.toFixed(1)}M</strong></div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {sorted.map(sd=>{ const cost=(sd.itSpend*sd.debtPct/100); const l=getLevel(sd.debt); return (
          <div key={sd.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:155, fontSize:9, fontWeight:600, color:BB.dark, textAlign:"right", flexShrink:0, lineHeight:1.2 }}>{sd.name}</div>
            <div style={{ flex:1, background:BB.mid, borderRadius:2, height:13, overflow:"hidden" }}>
              <div style={{ width:`${Math.round((cost/maxVal)*100)}%`, background:l.color, height:"100%", borderRadius:2 }} />
            </div>
            <div style={{ width:40, fontSize:9, fontWeight:800, color:l.color, flexShrink:0 }}>${cost.toFixed(1)}M</div>
          </div>
        );})}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4, paddingTop:6, borderTop:`2px solid ${BB.dark}` }}>
          <div style={{ width:155, fontSize:10, fontWeight:800, color:BB.dark, textAlign:"right", flexShrink:0 }}>TOTAL</div>
          <div style={{ flex:1, background:BB.dark, borderRadius:2, height:13 }} />
          <div style={{ width:40, fontSize:10, fontWeight:900, color:BB.dark, flexShrink:0 }}>${total.toFixed(1)}M</div>
        </div>
      </div>
    </div>
  );
}

// ── dim legend ────────────────────────────────────────────────────
function DimLegend() {
  return (
    <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
      <span style={{ fontSize:9, fontWeight:800, color:BB.muted, textTransform:"uppercase", letterSpacing:0.5 }}>Dimensions:</span>
      {DIMS.map(d=><span key={d.key} style={{ fontSize:9, color:BB.muted }}>{d.icon} {d.label}</span>)}
      <span style={{ fontSize:9, color:BB.muted, marginLeft:4 }}>· dots = score 1–5</span>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────
export default function App() {
  const [domains,  setDomains]  = useState(DOMAINS);
  const [infraSds, setInfraSds] = useState(INFRA_SDS);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState({ commerce:true, services:true, scm:true, data:true, store:false, corporate:false, infra:true });
  const [view, setView] = useState("heatmap");

  const tog    = id => setOpen(p=>({...p,[id]:!p[id]}));
  const saveSD = u  => {
    setDomains(prev=>prev.map(l1=>({...l1,subdomains:l1.subdomains.map(sd=>sd.id===u.id?u:sd)})));
    setInfraSds(prev=>prev.map(sd=>sd.id===u.id?u:sd));
    setSelected(u);
  };

  const allSDs     = [...domains.flatMap(d=>d.subdomains), ...infraSds];
  const totalSpend = allSDs.reduce((s,d)=>s+d.itSpend,0);
  const totalCost  = allSDs.reduce((s,d)=>s+(d.itSpend*d.debtPct/100),0);
  const avgScore   = (allSDs.reduce((s,d)=>s+d.debt,0)/allSDs.length).toFixed(1);
  const highCount  = allSDs.filter(d=>d.debt>=4).length;

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:BB.bg, minHeight:"100vh", padding:16 }}>
      {/* header */}
      <div style={{ background:BB.dark, borderRadius:8, padding:"14px 20px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:0, flexShrink:0 }}>
            <div style={{ background:BB.yellow, borderRadius:"4px 0 0 4px", padding:"5px 8px", fontWeight:900, fontSize:13, color:BB.dark, letterSpacing:-0.5, lineHeight:1 }}>BEST</div>
            <div style={{ background:BB.yellow, borderRadius:"0 4px 4px 0", padding:"5px 8px", fontWeight:900, fontSize:13, color:BB.dark, letterSpacing:-0.5, lineHeight:1, borderLeft:"1px solid rgba(0,0,0,0.12)" }}>BUY</div>
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.15)" }} />
          <div>
            <div style={{ color:BB.white, fontWeight:800, fontSize:15, letterSpacing:0.1 }}>Tech Debt Heatmap</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginTop:1 }}>Click any domain to inspect or edit · All values illustrative</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["heatmap","Heatmap"],["summary","Summary"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{ background:view===v?BB.yellow:"transparent", color:view===v?BB.dark:"rgba(255,255,255,0.55)", border:view===v?"none":`1px solid rgba(255,255,255,0.2)`, borderRadius:5, padding:"6px 14px", fontWeight:700, fontSize:11, cursor:"pointer", transition:"all 0.15s" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
        {[
          ["Addressable IT Spend","$"+totalSpend+"M",BB.blue],
          ["Est. Annual Debt Cost","$"+totalCost.toFixed(1)+"M","#9B2020"],
          ["Avg Portfolio Debt Score",avgScore+" / 5","#B45309"],
          ["High / Very High Domains",highCount+" of "+allSDs.length,BB.dark],
        ].map(([l,v,c])=>(
          <div key={l} style={{ background:BB.white, borderRadius:8, padding:"12px 14px", border:`1px solid ${BB.mid}`, borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:9, color:BB.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:0.4 }}>{l}</div>
            <div style={{ fontSize:20, fontWeight:900, color:c, marginTop:5 }}>{v}</div>
          </div>
        ))}
      </div>

      {view==="heatmap" ? (
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ flex:1, minWidth:0 }}>
            {/* legend row */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
              <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ fontSize:9, fontWeight:800, color:BB.muted, textTransform:"uppercase", letterSpacing:0.5 }}>Debt:</span>
                {DEBT_LEVELS.map(d=><span key={d.score} style={{ background:d.bg, color:d.color, border:`1px solid ${d.color}40`, padding:"2px 8px", borderRadius:4, fontSize:9, fontWeight:700 }}>{d.label}</span>)}
              </div>
              <DimLegend />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {domains.map(d=><L1Block key={d.id} domain={d} activeId={selected?.id} onSelect={setSelected} open={!!open[d.id]} onToggle={()=>tog(d.id)} />)}
              </div>
              <div style={{ position:"relative", paddingTop:10 }}>
                <div style={{ position:"absolute", top:2, left:"50%", transform:"translateX(-50%)", background:BB.blue, color:"#fff", fontSize:8, fontWeight:800, padding:"2px 10px", borderRadius:10, textTransform:"uppercase", letterSpacing:1 }}>Foundation Layer</div>
                <InfraLayer sds={infraSds} activeId={selected?.id} onSelect={setSelected} open={!!open.infra} onToggle={()=>tog("infra")} />
              </div>
            </div>
            <div style={{ marginTop:10, fontSize:9, color:"#C0C4CB", textAlign:"center" }}>All domain scores, spend figures and characterisations are illustrative — intended to prompt discussion, not assert findings.</div>
          </div>
          {selected && (
            <div style={{ width:278, flexShrink:0, position:"sticky", top:16 }}>
              <DetailPanel sd={selected} onClose={()=>setSelected(null)} onSave={saveSD} />
            </div>
          )}
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ background:BB.white, borderRadius:8, padding:16, border:`1px solid ${BB.mid}`, gridColumn:"1 / -1" }}>
            <Quadrant allSDs={allSDs} onDotClick={sd=>{ setSelected(sd); setView("heatmap"); }} />
          </div>
          <div style={{ background:BB.white, borderRadius:8, padding:16, border:`1px solid ${BB.mid}` }}>
            <L1Bars domains={domains} infraSds={infraSds} />
          </div>
          <div style={{ background:BB.white, borderRadius:8, padding:16, border:`1px solid ${BB.mid}` }}>
            <TopFive allSDs={allSDs} onSelect={sd=>{ setSelected(sd); setView("heatmap"); }} />
          </div>
          <div style={{ background:BB.white, borderRadius:8, padding:16, border:`1px solid ${BB.mid}`, gridColumn:"1 / -1" }}>
            <Waterfall allSDs={allSDs} />
          </div>
        </div>
      )}
    </div>
  );
}