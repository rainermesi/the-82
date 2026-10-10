"use client";

import { ExternalLink, MapPin, Mountain, Tent, X } from "lucide-react";
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
import { segmentHutLabel } from "@/lib/huts";
import { peakLinks } from "@/lib/links";
import { useProgress } from "./progress-provider";
import { countryLabel, GradeBadge, SeasonBadge } from "./peak-meta";
import { useState, type ReactNode } from "react";

export function PeakInfo({
  peak,
  onClose,
  onOpenHut,
}: {
  peak: Peak;
  onClose: () => void;
  onOpenHut: (id: string) => void;
}) {
  const { progress, isClimbed, markClimbed, markUnclimbed } = useProgress();
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const climbed = isClimbed(peak.id);
  const ascent = progress[peak.id];
  const hub = HUB_BY_ID[peak.hubId];
  const combo = COMBO_BY_ID[peak.comboId];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3 p-4 pb-2">
        <div className="min-w-0">
          <h2 className="font-heading text-2xl leading-tight">{peak.name}</h2>
          <p className="text-sm text-muted-foreground">
            UIAA #{peak.rank} · {peak.elevation.toLocaleString("en")} m ·{" "}
            {countryLabel(peak.countries)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close peak details"
        >
          <X />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2">
          <SeasonBadge season={peak.season} />
          <GradeBadge grade={peak.grade} />
          <span className="self-center text-xs text-muted-foreground">
            {peak.days} day{peak.days === 1 ? "" : "s"} from the valley
          </span>
        </div>

        <p className="text-sm leading-relaxed">{peak.seasonWhy}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{peak.notes}</p>

        <div className="grid grid-cols-1 gap-3 text-sm">
          <InfoRow icon={<MapPin className="size-4" />} label="Base">
            {hub?.name} — sleep in {hub?.sleep}
          </InfoRow>
          <InfoRow icon={<Mountain className="size-4" />} label="Route">
            {peak.normalRoute}
          </InfoRow>
          <InfoRow icon={<Tent className="size-4" />} label="Hut">
            <HutLabel label={peak.hut} onOpenHut={onOpenHut} />
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
            <p className="text-sm font-medium">{climbed ? "Climbed" : "Mark as climbed"}</p>
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
          <h3 className="font-heading mb-2 text-base">Supporting documents</h3>
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
    </div>
  );
}

export function PeakDetail({
  peak,
  onClose,
  onOpenHut,
}: {
  peak: Peak | null;
  onClose: () => void;
  onOpenHut: (id: string) => void;
}) {
  return (
    <Sheet open={Boolean(peak)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full overflow-hidden p-0 sm:max-w-md"
      >
        {peak && (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>{peak.name}</SheetTitle>
              <SheetDescription>
                UIAA #{peak.rank} · {peak.elevation.toLocaleString("en")} m ·{" "}
                {countryLabel(peak.countries)}
              </SheetDescription>
            </SheetHeader>
            <PeakInfo key={peak.id} peak={peak} onClose={onClose} onOpenHut={onOpenHut} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function HutLabel({
  label,
  onOpenHut,
}: {
  label: string;
  onOpenHut: (id: string) => void;
}) {
  return (
    <>
      {segmentHutLabel(label).map((part, index) =>
        part.hut ? (
          <button
            key={`${part.hut.id}-${index}`}
            type="button"
            onClick={() => onOpenHut(part.hut!.id)}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {part.text}
          </button>
        ) : (
          <span key={`text-${index}`}>{part.text}</span>
        ),
      )}
    </>
  );
}

export function InfoRow({
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
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
