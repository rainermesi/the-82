import type { AlpineGrade, SeasonFit } from "@/data/types";

export const GRADE_ORDER: AlpineGrade[] = [
  "F",
  "PD-",
  "PD",
  "PD+",
  "AD-",
  "AD",
  "AD+",
  "D",
  "D+",
  "TD-",
];

export function gradeRank(grade: AlpineGrade): number {
  return GRADE_ORDER.indexOf(grade);
}

export function withinGrade(grade: AlpineGrade, max: AlpineGrade): boolean {
  return gradeRank(grade) <= gradeRank(max);
}

export const SEASON_LABEL: Record<SeasonFit, string> = {
  "ski-first": "Spring ski",
  either: "Either season",
  "summer-first": "Summer first",
  "summer-only": "Summer only",
};

export const SEASON_SHORT: Record<SeasonFit, string> = {
  "ski-first": "Ski",
  either: "Both",
  "summer-first": "Summer",
  "summer-only": "Summer",
};
