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

export type HutKind = "hut" | "bivouac";

export type Hut = {
  id: string;
  name: string;
  altNames?: string;
  elevation: number;
  lat: number;
  lon: number;
  countries: Country[];
  /** Valley the hut is approached from. */
  hubId: string;
  operator: string;
  kind: HutKind;
  beds?: number;
  phone?: string;
  website?: string;
  booking?: string;
  wikipedia?: string;
  /**
   * False when the building should not be planned as a bed
   * (destroyed, or declared unusable by the operator).
   */
  usable?: boolean;
  notes: string;
  /** Phrases in a peak's hut field that mean this hut. Longest match wins. */
  aliases: string[];
};

export type Ascent = {
  climbedAt?: string;
  notes?: string;
};

export type ProgressMap = Record<string, Ascent>;
