"use client";

import { PEAKS } from "@/data/peaks";
import type { Peak, SeasonFit } from "@/data/types";
import { useProgress } from "./progress-provider";
import { GradeBadge, SeasonBadge } from "./peak-meta";
import { HUB_BY_ID } from "@/data/hubs";

const GROUPS: { season: SeasonFit; title: string; copy: string }[] = [
  {
    season: "ski-first",
    title: "Do these as spring ski tours",
    copy: "March to May, stable névé. You will move faster, avoid summer rockfall on easy glacier peaks, and empty a lot of the list before you spend July on the hard ridges. Still climbable in summer if the snow year is a write-off.",
  },
  {
    season: "either",
    title: "Either season",
    copy: "Glacier 4000ers that work as a ski in spring and a straightforward summer climb. Schedule them around the rest of the trip, not the other way around.",
  },
  {
    season: "summer-first",
    title: "Summer first, ski only if you already ski hard",
    copy: "Normal routes are summer snow/mixed. Expert ski descents exist (Aletschhorn, Dom, Lyskamm flanks) but they are not how most people tick the list.",
  },
  {
    season: "summer-only",
    title: "Summer only",
    copy: "Rock towers, mixed ridges, and north-face country. Hörnli, Géant, Verte, Jorasses, Diable, Peuterey, Weisshorn, Schreckhorn. Do not park these in a ski week.",
  },
];

export function SeasonGuide({ onSelect }: { onSelect: (id: string) => void }) {
  const { isClimbed, remaining } = useProgress();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-xl">Winter / spring vs summer</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
          A 4000er is not automatically a summer mountain. The efficient lifetime plan
          is: ski the easy glacier peaks in spring, spend summer on rock and mixed,
          and keep Écrins / Bernina as their own weekends. Remaining: {remaining}.
        </p>
      </div>
      {GROUPS.map((group) => {
        const peaks = PEAKS.filter((p) => p.season === group.season);
        const left = peaks.filter((p) => !isClimbed(p.id));
        const done = peaks.length - left.length;
        return (
          <section key={group.season} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <SeasonBadge season={group.season} />
              <h3 className="font-heading text-lg">{group.title}</h3>
              <span className="text-sm text-muted-foreground">
                {done}/{peaks.length} climbed
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-3xl">{group.copy}</p>
            {left.length === 0 ? (
              <p className="text-sm">This bucket is empty. Well done.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {left.map((peak) => (
                  <PeakChip key={peak.id} peak={peak} onSelect={onSelect} />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

function PeakChip({ peak, onSelect }: { peak: Peak; onSelect: (id: string) => void }) {
  const hub = HUB_BY_ID[peak.hubId];
  return (
    <button
      type="button"
      onClick={() => onSelect(peak.id)}
      className="rounded-xl border bg-card px-3 py-2 text-left hover:border-primary/40"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm">{peak.name}</span>
        <GradeBadge grade={peak.grade} />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {peak.elevation} m · {hub?.shortName} · {peak.hut}
      </p>
    </button>
  );
}
