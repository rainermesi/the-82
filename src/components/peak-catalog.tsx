"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { HUBS } from "@/data/hubs";
import type { Peak, SeasonFit } from "@/data/types";
import { SEASON_LABEL } from "@/lib/grades";
import { useProgress } from "./progress-provider";
import { GradeBadge, SeasonBadge } from "./peak-meta";
import { Button } from "@/components/ui/button";

const SEASONS: Array<SeasonFit | "all"> = [
  "all",
  "ski-first",
  "either",
  "summer-first",
  "summer-only",
];

export function PeakCatalog({
  peaks,
  onSelect,
  hubFilter,
  onHubFilter,
}: {
  peaks: Peak[];
  onSelect: (id: string) => void;
  hubFilter: string | "all";
  onHubFilter: (hub: string | "all") => void;
}) {
  const { isClimbed } = useProgress();
  const [q, setQ] = useState("");
  const [season, setSeason] = useState<SeasonFit | "all">("all");
  const [status, setStatus] = useState<"all" | "left" | "done">("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return peaks.filter((p) => {
      if (hubFilter !== "all" && p.hubId !== hubFilter) return false;
      if (season !== "all" && p.season !== season) return false;
      const climbed = isClimbed(p.id);
      if (status === "left" && climbed) return false;
      if (status === "done" && !climbed) return false;
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query) ||
        p.altNames?.toLowerCase().includes(query) ||
        p.massif.toLowerCase().includes(query) ||
        p.hut.toLowerCase().includes(query)
      );
    });
  }, [peaks, q, season, status, hubFilter, isClimbed]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, massif, hut…"
          className="lg:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {SEASONS.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={season === s ? "default" : "outline"}
              onClick={() => setSeason(s)}
            >
              {s === "all" ? "All seasons" : SEASON_LABEL[s]}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={hubFilter === "all" ? "default" : "outline"}
          onClick={() => onHubFilter("all")}
        >
          All clusters
        </Button>
        {HUBS.map((hub) => (
          <Button
            key={hub.id}
            size="sm"
            variant={hubFilter === hub.id ? "default" : "outline"}
            onClick={() => onHubFilter(hub.id)}
          >
            {hub.shortName}
          </Button>
        ))}
        <Button
          size="sm"
          variant={status === "left" ? "default" : "outline"}
          onClick={() => setStatus(status === "left" ? "all" : "left")}
        >
          Still to climb
        </Button>
        <Button
          size="sm"
          variant={status === "done" ? "default" : "outline"}
          onClick={() => setStatus(status === "done" ? "all" : "done")}
        >
          Climbed
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No peaks match these filters. Clear the search or switch cluster.
        </div>
      ) : (
        <ul className="divide-y rounded-xl border bg-card">
          {filtered.map((peak) => {
            const climbed = isClimbed(peak.id);
            return (
              <li key={peak.id}>
                <button
                  type="button"
                  onClick={() => onSelect(peak.id)}
                  className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-muted/60 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">
                    #{peak.rank}
                  </span>
                  <span className="flex-1 font-medium">
                    {peak.name}
                    {climbed && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        climbed
                      </span>
                    )}
                  </span>
                  <span className="w-20 tabular-nums text-sm">{peak.elevation} m</span>
                  <span className="hidden w-36 text-sm text-muted-foreground lg:block">
                    {peak.massif}
                  </span>
                  <GradeBadge grade={peak.grade} />
                  <SeasonBadge season={peak.season} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">{filtered.length} peaks</p>
    </div>
  );
}
