"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Peak } from "@/data/types";
import { HUT_CLOSED_COLOR, HUT_COLOR } from "@/data/huts";
import { HUB_BY_ID } from "@/data/hubs";
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
  selectedHutId,
  focusHubId,
  focusRequestId,
  onSelect,
  onSelectHut,
  onFocusHub,
  onClearFocus,
}: {
  peaks: Peak[];
  selectedId: string | null;
  selectedHutId: string | null;
  focusHubId: string | null;
  focusRequestId: number;
  onSelect: (id: string) => void;
  onSelectHut: (id: string) => void;
  onFocusHub: (hubId: string) => void;
  onClearFocus: () => void;
}) {
  const hub = focusHubId ? HUB_BY_ID[focusHubId] : undefined;
  const [showHuts, setShowHuts] = useState(true);

  return (
    <div className="flex h-full min-h-[420px] flex-col gap-2">
      <div className="relative isolate z-0 min-h-[420px] flex-1 overflow-hidden rounded-xl border">
        <AlpsMap
          peaks={peaks}
          selectedId={selectedId}
          selectedHutId={selectedHutId}
          showHuts={showHuts}
          focusHubId={focusHubId}
          focusRequestId={focusRequestId}
          onSelect={onSelect}
          onSelectHut={onSelectHut}
          onFocusHub={onFocusHub}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {hub ? (
          <span className="inline-flex flex-wrap items-center gap-2">
            <span>
              Showing <strong className="text-foreground">{hub.shortName}</strong> —{" "}
              {hub.region}
            </span>
            <button
              type="button"
              onClick={onClearFocus}
              className="rounded-full border px-2 py-0.5 text-foreground hover:bg-muted"
            >
              All Alps
            </button>
          </span>
        ) : (
          <span>Open a cluster, or zoom in, to split basins into summits and huts.</span>
        )}
        <button
          type="button"
          aria-pressed={showHuts}
          onClick={() => setShowHuts((value) => !value)}
          className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-foreground hover:bg-muted"
        >
          <span
            className="inline-block size-2.5 border border-[#f6f1ea]"
            style={{ background: showHuts ? HUT_COLOR : "transparent", transform: "rotate(45deg)" }}
          />
          Huts
        </button>
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
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 border border-[#f6f1ea]"
            style={{ background: HUT_CLOSED_COLOR, transform: "rotate(45deg)" }}
          />
          Hut not usable
        </span>
      </div>
    </div>
  );
}
