"use client";

import { ExternalLink, MapPin, Mountain, Tent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { COMBO_BY_ID } from "@/data/combos";
import { HUB_BY_ID } from "@/data/hubs";
import type { Peak } from "@/data/types";
import { peakLinks } from "@/lib/links";
import { useProgress } from "./progress-provider";
import { countryLabel, GradeBadge, SeasonBadge } from "./peak-meta";
import { useState, type ReactNode } from "react";

export function PeakDetail({
  peak,
  onClose,
}: {
  peak: Peak | null;
  onClose: () => void;
}) {
  const { progress, isClimbed, markClimbed, markUnclimbed } = useProgress();
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const climbed = peak ? isClimbed(peak.id) : false;
  const ascent = peak ? progress[peak.id] : undefined;
  const hub = peak ? HUB_BY_ID[peak.hubId] : undefined;
  const combo = peak ? COMBO_BY_ID[peak.comboId] : undefined;

  return (
    <Sheet open={Boolean(peak)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        {peak && (
          <>
            <SheetHeader>
              <SheetTitle className="font-heading text-2xl pr-8">
                {peak.name}
              </SheetTitle>
              <SheetDescription>
                UIAA #{peak.rank} · {peak.elevation.toLocaleString("en")} m ·{" "}
                {countryLabel(peak.countries)}
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-8 flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                <SeasonBadge season={peak.season} />
                <GradeBadge grade={peak.grade} />
                <span className="text-xs text-muted-foreground self-center">
                  {peak.days} day{peak.days === 1 ? "" : "s"} from the valley
                </span>
              </div>

              <p className="text-sm leading-relaxed">{peak.seasonWhy}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {peak.notes}
              </p>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <InfoRow icon={<MapPin className="size-4" />} label="Base">
                  {hub?.name} — sleep in {hub?.sleep}
                </InfoRow>
                <InfoRow icon={<Mountain className="size-4" />} label="Route">
                  {peak.normalRoute}
                </InfoRow>
                <InfoRow icon={<Tent className="size-4" />} label="Hut">
                  {peak.hut}
                </InfoRow>
                <InfoRow icon={<Mountain className="size-4" />} label="Same trip">
                  {combo?.name}. {combo?.blurb}
                </InfoRow>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Checkbox
                  checked={climbed}
                  onCheckedChange={(checked) => {
                    if (checked) markClimbed(peak.id, date || undefined, notes || undefined);
                    else markUnclimbed(peak.id);
                  }}
                />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">
                    {climbed ? "Climbed" : "Mark as climbed"}
                  </p>
                  {climbed && ascent?.climbedAt && (
                    <p className="text-xs text-muted-foreground">
                      Logged {ascent.climbedAt}
                      {ascent.notes ? ` — ${ascent.notes}` : ""}
                    </p>
                  )}
                  {!climbed && (
                    <div className="flex flex-col gap-2">
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        aria-label="Ascent date"
                      />
                      <Input
                        placeholder="Notes (conditions, partners…)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-heading text-base mb-2">Supporting documents</h3>
                <ul className="flex flex-col gap-1.5">
                  {peakLinks(peak).map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                      >
                        {link.label}
                        <ExternalLink className="size-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
