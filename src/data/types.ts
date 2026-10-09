export type Country = "FR" | "IT" | "CH";

export type SeasonFit = "ski-first" | "either" | "summer-first" | "summer-only";

export type AlpineGrade =
  | "F"
  | "PD-"
  | "PD"
  | "PD+"
  | "AD-"
  | "AD"
  | "AD+"
  | "D"
  | "D+"
  | "TD-";

export type Link = {
  label: string;
  url: string;
};

export type Peak = {
  id: string;
  rank: number;
  name: string;
  altNames?: string;
  elevation: number;
  prominence: number;
  lat: number;
  lon: number;
  countries: Country[];
  massif: string;
  hubId: string;
  comboId: string;
  season: SeasonFit;
  seasonWhy: string;
  grade: AlpineGrade;
  days: number;
  hut: string;
  normalRoute: string;
  summitpost?: string;
  wikipedia: string;
  notes: string;
};

export type Hub = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  lat: number;
  lon: number;
  fly: string;
  sleep: string;
  bestMonths: string;
  blurb: string;
};

export type Combo = {
  id: string;
  name: string;
  hubId: string;
  days: number;
  grade: AlpineGrade;
  season: SeasonFit;
  blurb: string;
};

export type Ascent = {
  climbedAt?: string;
  notes?: string;
};

export type ProgressMap = Record<string, Ascent>;
