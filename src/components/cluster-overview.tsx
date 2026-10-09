"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { clusterStats, planTrips } from "@/lib/planner";
import { useProgress } from "./progress-provider";
import { SeasonBadge } from "./peak-meta";
import { Button } from "@/components/ui/button";

export function ClusterOverview({
  onOpenHub,
  onPlan,
}: {
  onOpenHub: (hubId: string) => void;
  onPlan: () => void;
}) {
  const { progress, climbed, remaining } = useProgress();
  const clusters = clusterStats(progress);
  const nextSummer = planTrips(progress, 10, "summer", "TD-")[0];
  const nextSki = planTrips(progress, 7, "spring-ski", "PD+")[0];

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Lifetime list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-heading">
              {climbed}
              <span className="text-muted-foreground text-lg"> / 82</span>
            </p>
            <Progress value={(climbed / 82) * 100} />
            <p className="text-sm text-muted-foreground">
              {remaining === 82
                ? "Nothing logged yet. Mark peaks as you climb them — progress stays in this browser."
                : remaining === 0
                  ? "The list is complete. Time for the enlarged UIAA 46, or a rest day."
                  : `${remaining} still to climb.`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Next summer block</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {nextSummer ? (
              <>
                <p className="font-medium">{nextSummer.hubName}</p>
                <p>
                  {nextSummer.peaks.length} peaks in {nextSummer.days} days ·{" "}
                  {nextSummer.sleep}
                </p>
                <p className="text-muted-foreground">Fly {nextSummer.fly}.</p>
              </>
            ) : (
              <p className="text-muted-foreground">No summer peaks left in range.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Next spring ski week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {nextSki ? (
              <>
                <p className="font-medium">{nextSki.hubName}</p>
                <p>
                  {nextSki.peaks.length} ski-friendly 4000ers in {nextSki.days} days
                </p>
                <p className="text-muted-foreground">{nextSki.sleep}</p>
              </>
            ) : (
              <p className="text-muted-foreground">
                The easy ski 4000ers are done. Remaining ski descents are optional extras.
              </p>
            )}
            <Button size="sm" variant="outline" onClick={onPlan}>
              Open trip planner
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="font-heading text-xl mb-3">Where the peaks cluster</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          The 82 UIAA 4000ers sit in nine logistics basins, not 82 separate trips.
          Chamonix and the Valais hold most of the list. Écrins, Bernina and Gran Paradiso
          are outliers — budget them as their own weekends.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {clusters.map(({ hub, total, done, remaining: left, ski, summerOnly, hardestLeft }) => (
            <button
              key={hub.id}
              type="button"
              onClick={() => onOpenHub(hub.id)}
              className="text-left rounded-xl border bg-card p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-heading text-lg">{hub.shortName}</h3>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {done}/{total}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{hub.region}</p>
              <Progress value={(done / total) * 100} className="my-3" />
              <p className="text-sm leading-relaxed">{hub.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-muted px-2 py-0.5">
                  {left} left
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5">{ski} ski-friendly</span>
                <span className="rounded-full bg-muted px-2 py-0.5">
                  {summerOnly} summer-only
                </span>
              </div>
              {hardestLeft && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Hardest left</span>
                  <span>{hardestLeft.name}</span>
                  <SeasonBadge season={hardestLeft.season} />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
