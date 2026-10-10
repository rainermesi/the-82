"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AlpineGrade } from "@/data/types";
import { GRADE_ORDER } from "@/lib/grades";
import { planLifetime, planTrips, type SeasonFilter } from "@/lib/planner";
import { useProgress } from "./progress-provider";

export function TripPlanner({ onSelectPeak }: { onSelectPeak: (id: string) => void }) {
  const { progress, remaining } = useProgress();
  const [days, setDays] = useState(10);
  const [season, setSeason] = useState<SeasonFilter>("summer");
  const [maxGrade, setMaxGrade] = useState<AlpineGrade>("AD");
  const [springDays, setSpringDays] = useState(7);
  const [summerDays, setSummerDays] = useState(14);

  const trips = useMemo(
    () => planTrips(progress, days, season, maxGrade),
    [progress, days, season, maxGrade],
  );

  const lifetime = useMemo(
    () => planLifetime(progress, springDays, summerDays, maxGrade, 15),
    [progress, springDays, summerDays, maxGrade],
  );

  const lifetimeTotal = useMemo(() => {
    const ids = new Set<string>();
    for (const year of lifetime) {
      for (const peak of year.peaks) {
        if (!progress[peak.id]) ids.add(peak.id);
      }
    }
    return ids.size;
  }, [lifetime, progress]);
  const leftOut = Math.max(0, remaining - lifetimeTotal);

  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-3">
        <h2 className="font-heading text-xl">Pack this year’s trip</h2>
        <p className="text-sm text-muted-foreground max-w-3xl">
          The planner fills remaining peaks into one logistics basin so you are not
          driving from Chamonix to Pontresina in the same week. It packs whole
          ridge traverses first — that is how you actually bag many 4000ers.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Days</span>
          {[7, 10, 14].map((d) => (
            <Button
              key={d}
              size="sm"
              variant={days === d ? "default" : "outline"}
              onClick={() => setDays(d)}
            >
              {d}
            </Button>
          ))}
          <span className="text-sm text-muted-foreground ml-2">Season</span>
          {(
            [
              ["summer", "Summer"],
              ["spring-ski", "Spring ski"],
              ["any", "Either"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={season === value ? "default" : "outline"}
              onClick={() => setSeason(value)}
            >
              {label}
            </Button>
          ))}
          <span className="text-sm text-muted-foreground ml-2">Max grade</span>
          {GRADE_ORDER.filter((g) => ["PD", "PD+", "AD", "D", "TD-"].includes(g)).map(
            (g) => (
              <Button
                key={g}
                size="sm"
                variant={maxGrade === g ? "default" : "outline"}
                onClick={() => setMaxGrade(g)}
              >
                {g}
              </Button>
            ),
          )}
        </div>
      </section>

      {trips.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nothing left that fits this grade and season. Raise the grade cap or switch
          season.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {trips.slice(0, 4).map((trip, index) => (
            <Card key={trip.hubId}>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-baseline justify-between gap-2">
                  <span>
                    {index === 0 ? "Best fit: " : ""}
                    {trip.hubName}
                  </span>
                  <span className="text-sm font-sans font-normal text-muted-foreground">
                    {trip.peaks.length} peaks / {trip.days}d
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Sleep in {trip.sleep}. Fly {trip.fly}. About{" "}
                  {trip.peaksPerDay.toFixed(1)} peaks per day if the weather holds.
                </p>
                {trip.leftover > 0 && (
                  <p className="text-muted-foreground">
                    {trip.leftover} more in this cluster won’t fit this visit — leave
                    them for a return.
                  </p>
                )}
                <ol className="space-y-3">
                  {trip.combos.map((combo) => (
                    <li key={combo.comboId} className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{combo.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {combo.days}d · {combo.grade}
                        </span>
                      </div>
                      <p className="mt-1 text-muted-foreground">{combo.blurb}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {combo.peaks.map((peak) => (
                          <button
                            key={peak.id}
                            type="button"
                            onClick={() => onSelectPeak(peak.id)}
                            className="rounded-full bg-background px-2 py-0.5 text-xs hover:ring-1 hover:ring-primary"
                          >
                            {peak.name}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-heading text-xl">A lifetime sequence</h2>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Assuming one spring ski week and one summer block each year, staying at or
          under {maxGrade}. Easy ski clusters go first; the D-grade Mont Blanc
          satellites wait until you are actually climbing at that standard.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Spring days</span>
          {[5, 7, 10].map((d) => (
            <Button
              key={d}
              size="sm"
              variant={springDays === d ? "default" : "outline"}
              onClick={() => setSpringDays(d)}
            >
              {d}
            </Button>
          ))}
          <span className="text-sm text-muted-foreground ml-2">Summer days</span>
          {[7, 10, 14].map((d) => (
            <Button
              key={d}
              size="sm"
              variant={summerDays === d ? "default" : "outline"}
              onClick={() => setSummerDays(d)}
            >
              {d}
            </Button>
          ))}
        </div>
        <p className="text-sm">
          {remaining === 0 ? (
            <>Every peak on the list is already logged.</>
          ) : lifetimeTotal === 0 ? (
            <>
              <strong>{remaining}</strong>{" "}
              {remaining === 1 ? "peak is" : "peaks are"} still unclimbed. None of
              them fit this grade and these day counts — raise the grade cap or add
              days.
            </>
          ) : leftOut === 0 ? (
            <>
              This cadence knocks off all <strong>{remaining}</strong> unclimbed{" "}
              {remaining === 1 ? "peak" : "peaks"} across{" "}
              <strong>{lifetime.length}</strong>{" "}
              {lifetime.length === 1 ? "year" : "years"}.
            </>
          ) : (
            <>
              <strong>{remaining}</strong>{" "}
              {remaining === 1 ? "peak is" : "peaks are"} still unclimbed. This
              cadence knocks off <strong>{lifetimeTotal}</strong> of them across{" "}
              <strong>{lifetime.length}</strong>{" "}
              {lifetime.length === 1 ? "year" : "years"} — raise the grade cap or
              add days to finish the other{" "}
              <strong>{leftOut}</strong>.
            </>
          )}
        </p>
        <ol className="space-y-3">
          {lifetime.map((year) => (
            <li key={year.year} className="rounded-xl border bg-card p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-heading text-lg">Year {year.year}</h3>
                <span className="text-sm text-muted-foreground">
                  {year.peaks.length} peaks
                </span>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {year.spring && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Spring ski · {year.spring.hubName}
                    </p>
                    <p className="text-sm mt-1">
                      {year.spring.peaks.map((p) => p.name).join(", ")}
                    </p>
                  </div>
                )}
                {year.summer && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Summer · {year.summer.hubName}
                    </p>
                    <p className="text-sm mt-1">
                      {year.summer.peaks.map((p) => p.name).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
        {lifetime.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nothing left to sequence at this grade.
          </p>
        )}
      </section>
    </div>
  );
}
