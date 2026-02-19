export interface DebtLevel {
  label: string;
  score: 1 | 2 | 3 | 4 | 5;
  color: string;
  bg: string;
}

export interface Dimension {
  key: "bizValue" | "skillsObs" | "talentConc" | "vendorDep";
  label: string;
  icon: string;
  desc: string;
}

export type StrategicLevel = "Low" | "Medium" | "High" | "Critical";

export interface Subdomain {
  id: string;
  name: string;
  debt: 1 | 2 | 3 | 4 | 5;
  strategic: StrategicLevel;
  itSpend: number;
  debtPct: number;
  bizValue: 1 | 2 | 3 | 4 | 5;
  skillsObs: 1 | 2 | 3 | 4 | 5;
  talentConc: 1 | 2 | 3 | 4 | 5;
  vendorDep: 1 | 2 | 3 | 4 | 5;
  strengths: string[];
  opportunities: string[];
}

export interface Domain {
  id: string;
  label: string;
  icon: string;
  subdomains: Subdomain[];
}

export type OpenState = Record<string, boolean>;
