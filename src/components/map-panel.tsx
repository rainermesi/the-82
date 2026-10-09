"use client";

import dynamic from "next/dynamic";
import type { Peak } from "@/data/types";
import { SEASON_COLOR } from "./peak-meta";
import { SEASON_LABEL } from "@/lib/grades";

const AlpsMap = dynamic(() => import("./alps-map").then((m) => m.AlpsMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-xl border bg-muted/40 text-sm text-muted-foreground">
      Loading topographic map…
    </div>
  ),
});

export function MapPanel({
  peaks,
  selectedId,
  onSelect,
}: {
  peaks: Peak[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex h-full min-h-[420px] flex-col gap-2">
      <div className="relative isolate z-0 min-h-[420px] flex-1 overflow-hidden rounded-xl border">
        <AlpsMap peaks={peaks} selectedId={selectedId} onSelect={onSelect} />
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>Zoom in to split clusters into individual summits.</span>
        {(Object.keys(SEASON_COLOR) as Array<keyof typeof SEASON_COLOR>).map((key) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ background: SEASON_COLOR[key] }}
            />
            {SEASON_LABEL[key]}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-gray-400" />
          Climbed
        </span>
      </div>
    </div>
  );
}
