import { COMBOS, COMBO_BY_ID } from "@/data/combos";
import { HUB_BY_ID, HUBS } from "@/data/hubs";
import { PEAKS } from "@/data/peaks";
import type { AlpineGrade, Peak, ProgressMap, SeasonFit } from "@/data/types";
import { gradeRank, withinGrade } from "./grades";

export type SeasonFilter = "any" | "spring-ski" | "summer";

export function seasonMatches(season: SeasonFit, filter: SeasonFilter): boolean {
  if (filter === "any") return true;
  if (filter === "spring-ski") {
    return season === "ski-first" || season === "either";
  }
  return true;
}

export function remainingPeaks(
  progress: ProgressMap,
  filter: SeasonFilter = "any",
  maxGrade: AlpineGrade = "TD-",
): Peak[] {
  return PEAKS.filter(
    (p) =>
      !progress[p.id] &&
      seasonMatches(p.season, filter) &&
      withinGrade(p.grade, maxGrade),
  );
}

export type PackedCombo = {
  comboId: string;
  name: string;
  days: number;
  grade: AlpineGrade;
  peaks: Peak[];
  blurb: string;
};

export type TripOption = {
  hubId: string;
  hubName: string;
  fly: string;
  sleep: string;
  days: number;
  peaks: Peak[];
  combos: PackedCombo[];
  leftover: number;
  peaksPerDay: number;
  why: string;
};

function comboDaysForCount(fullDays: number, remaining: number, totalInCombo: number): number {
  if (remaining <= 0) return 0;
  if (remaining === totalInCombo) return fullDays;
  const ratio = remaining / totalInCombo;
  return Math.max(1, Math.round(fullDays * ratio));
}

export function planTrips(
  progress: ProgressMap,
  tripDays: number,
  season: SeasonFilter,
  maxGrade: AlpineGrade,
): TripOption[] {
  const remaining = remainingPeaks(progress, season, maxGrade);
  const remainingByCombo = new Map<string, Peak[]>();
  for (const peak of remaining) {
    const list = remainingByCombo.get(peak.comboId) ?? [];
    list.push(peak);
    remainingByCombo.set(peak.comboId, list);
  }

  const options: TripOption[] = [];

  for (const hub of HUBS) {
    const hubCombos = COMBOS.filter((c) => c.hubId === hub.id)
      .map((combo) => {
        const peaks = remainingByCombo.get(combo.id) ?? [];
        const total = PEAKS.filter((p) => p.comboId === combo.id).length;
        const days = comboDaysForCount(combo.days, peaks.length, total);
        return {
          combo,
          peaks: peaks.sort((a, b) => b.elevation - a.elevation),
          days,
          score: peaks.length === 0 ? 0 : peaks.length / days,
        };
      })
      .filter((c) => c.peaks.length > 0)
      .sort((a, b) => b.score - a.score || b.peaks.length - a.peaks.length);

    if (hubCombos.length === 0) continue;

    let daysLeft = tripDays;
    const packed: PackedCombo[] = [];
    const peaks: Peak[] = [];

    for (const item of hubCombos) {
      if (item.days <= daysLeft) {
        packed.push({
          comboId: item.combo.id,
          name: item.combo.name,
          days: item.days,
          grade: item.combo.grade,
          peaks: item.peaks,
          blurb: item.combo.blurb,
        });
        peaks.push(...item.peaks);
        daysLeft -= item.days;
      }
    }

    if (peaks.length === 0) continue;

    const daysUsed = tripDays - daysLeft;
    const leftover = remaining.filter((p) => p.hubId === hub.id).length - peaks.length;

    options.push({
      hubId: hub.id,
      hubName: hub.name,
      fly: hub.fly,
      sleep: hub.sleep,
      days: daysUsed,
      peaks,
      combos: packed,
      leftover,
      peaksPerDay: peaks.length / daysUsed,
      why: hub.blurb,
    });
  }

  return options.sort(
    (a, b) =>
      b.peaks.length - a.peaks.length ||
      b.peaksPerDay - a.peaksPerDay ||
      a.days - b.days,
  );
}

export type LifetimeYear = {
  year: number;
  spring?: TripOption;
  summer?: TripOption;
  peaks: Peak[];
};

export function planLifetime(
  progress: ProgressMap,
  springDays: number,
  summerDays: number,
  maxGrade: AlpineGrade,
  years = 12,
): LifetimeYear[] {
  const simulated: ProgressMap = { ...progress };
  const plan: LifetimeYear[] = [];

  for (let year = 1; year <= years; year++) {
    const spring = planTrips(simulated, springDays, "spring-ski", maxGrade)[0];
    if (spring) {
      for (const peak of spring.peaks) simulated[peak.id] = { climbedAt: `Year ${year} spring` };
    }

    const summer = planTrips(simulated, summerDays, "summer", maxGrade)[0];
    if (summer) {
      for (const peak of summer.peaks) simulated[peak.id] = { climbedAt: `Year ${year} summer` };
    }

    const peaks = [...(spring?.peaks ?? []), ...(summer?.peaks ?? [])];
    if (peaks.length === 0) break;
    plan.push({ year, spring, summer, peaks });
  }

  return plan;
}

export function clusterStats(progress: ProgressMap) {
  return HUBS.map((hub) => {
    const peaks = PEAKS.filter((p) => p.hubId === hub.id);
    const done = peaks.filter((p) => progress[p.id]).length;
    const ski = peaks.filter(
      (p) => !progress[p.id] && (p.season === "ski-first" || p.season === "either"),
    ).length;
    const summerOnly = peaks.filter(
      (p) => !progress[p.id] && p.season === "summer-only",
    ).length;
    return {
      hub,
      total: peaks.length,
      done,
      remaining: peaks.length - done,
      ski,
      summerOnly,
      hardestLeft: peaks
        .filter((p) => !progress[p.id])
        .sort((a, b) => gradeRank(b.grade) - gradeRank(a.grade))[0],
    };
  }).sort((a, b) => b.remaining - a.remaining);
}

export function comboLabel(comboId: string) {
  return COMBO_BY_ID[comboId]?.name ?? comboId;
}

export function hubLabel(hubId: string) {
  return HUB_BY_ID[hubId]?.name ?? hubId;
}
