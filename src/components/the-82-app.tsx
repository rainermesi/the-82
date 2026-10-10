"use client";

import { useMemo, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PEAKS } from "@/data/peaks";
import { GLOBAL_LINKS } from "@/lib/links";
import { exportProgress, parseProgress } from "@/lib/progress";
import { ClusterOverview } from "./cluster-overview";
import { MapPanel } from "./map-panel";
import { PeakCatalog } from "./peak-catalog";
import { PeakDetail, PeakInfo } from "./peak-detail";
import { ProgressProvider, useProgress } from "./progress-provider";
import { SeasonGuide } from "./season-guide";
import { TripPlanner } from "./trip-planner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function The82App() {
  return (
    <TooltipProvider>
      <ProgressProvider>
        <AppInner />
      </ProgressProvider>
    </TooltipProvider>
  );
}

const TABS = [
  { id: "overview", label: "Clusters" },
  { id: "map", label: "Map" },
  { id: "peaks", label: "Peaks" },
  { id: "plan", label: "Yearly trips" },
  { id: "seasons", label: "Winter vs summer" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AppInner() {
  const { climbed, remaining, progress, replaceProgress, reset, ready } = useProgress();
  const [tab, setTab] = useState<TabId>("overview");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hubFilter, setHubFilter] = useState<string | "all">("all");
  const [mapFocus, setMapFocus] = useState<{ hubId: string | null; n: number }>({
    hubId: null,
    n: 0,
  });

  const focusHub = (hubId: string | null) => {
    setMapFocus((prev) => ({ hubId, n: prev.n + 1 }));
  };

  const selected = useMemo(
    () => PEAKS.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );

  const openPeak = (id: string) => setSelectedId(id);
  const openHub = (hubId: string) => {
    setHubFilter(hubId);
    setSelectedId(null);
    focusHub(hubId);
    setTab("map");
  };

  const downloadProgress = () => {
    const blob = new Blob([exportProgress(progress)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "the-82-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadProgress = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        replaceProgress(parseProgress(await file.text()));
      } catch {
        window.alert("Could not read that progress file.");
      }
    };
    input.click();
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                UIAA Alpine four-thousanders
              </p>
              <h1 className="font-heading text-3xl leading-none">The 82</h1>
            </div>
            <div className="flex min-w-[180px] flex-col gap-1">
              <div className="flex items-baseline justify-between text-sm">
                <span>
                  {ready ? climbed : "—"} climbed
                </span>
                <span className="text-muted-foreground">{remaining} to go</span>
              </div>
              <Progress value={ready ? (climbed / 82) * 100 : 0} />
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={downloadProgress} title="Export log">
                <Download />
                Export
              </Button>
              <Button size="sm" variant="ghost" onClick={uploadProgress} title="Import log">
                <Upload />
                Import
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (window.confirm("Clear every logged ascent on this device?")) reset();
                }}
              >
                <RotateCcw />
                Reset
              </Button>
            </div>
          </div>
          <nav
            aria-label="Sections"
            className="flex w-full gap-1 overflow-x-auto border-b"
          >
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === "map") focusHub(null);
                    setTab(item.id);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`relative shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 bg-foreground" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {tab === "overview" && (
          <ClusterOverview onOpenHub={openHub} onPlan={() => setTab("plan")} />
        )}
        {tab === "map" && (
          <div className="flex h-[calc(100dvh-12rem)] min-h-[480px] flex-col gap-3 lg:flex-row">
            <div className="min-h-[280px] min-w-0 flex-1">
              <MapPanel
                peaks={PEAKS}
                selectedId={selectedId}
                focusHubId={mapFocus.hubId}
                focusRequestId={mapFocus.n}
                onSelect={openPeak}
                onFocusHub={focusHub}
                onClearFocus={() => focusHub(null)}
              />
            </div>
            {selected && (
              <aside className="relative z-10 h-[42%] min-h-[240px] overflow-hidden rounded-xl border bg-card shadow-sm lg:h-full lg:w-[24rem] lg:shrink-0">
                <PeakInfo
                  key={selected.id}
                  peak={selected}
                  onClose={() => setSelectedId(null)}
                />
              </aside>
            )}
          </div>
        )}
        {tab === "peaks" && (
          <PeakCatalog
            peaks={PEAKS}
            onSelect={openPeak}
            hubFilter={hubFilter}
            onHubFilter={setHubFilter}
          />
        )}
        {tab === "plan" && <TripPlanner onSelectPeak={openPeak} />}
        {tab === "seasons" && <SeasonGuide onSelect={openPeak} />}
      </main>

      <footer className="border-t py-6 text-xs text-muted-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Official UIAA list of 82 Alpine summits ≥ 4,000 m (1994, with the CAI).
            Elevations and coordinates from Wikipedia / Wikidata. Progress is stored
            only in this browser.
          </p>
          <div className="flex flex-wrap gap-3">
            {GLOBAL_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {tab !== "map" && (
        <PeakDetail peak={selected} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
