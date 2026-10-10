"use client";

import { ExternalLink, House, MapPin, Mountain, Phone, Tent, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { HUB_BY_ID } from "@/data/hubs";
import type { Hut } from "@/data/types";
import { peaksForHut } from "@/lib/huts";
import { hutLinks } from "@/lib/links";
import { InfoRow } from "./peak-detail";
import { countryLabel } from "./peak-meta";

export function HutInfo({
  hut,
  onClose,
  onOpenPeak,
  onBack,
  backLabel,
}: {
  hut: Hut;
  onClose: () => void;
  onOpenPeak: (id: string) => void;
  onBack?: () => void;
  backLabel?: string;
}) {
  const hub = HUB_BY_ID[hut.hubId];
  const peaks = peaksForHut(hut.id);
  const usable = hut.usable !== false;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3 p-4 pb-2">
        <div className="min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-1 text-xs text-primary hover:underline"
            >
              Back to {backLabel}
            </button>
          )}
          <h2 className="font-heading text-2xl leading-tight">{hut.name}</h2>
          <p className="text-sm text-muted-foreground">
            {hut.elevation.toLocaleString("en")} m · {countryLabel(hut.countries)}
            {hut.altNames ? ` · ${hut.altNames}` : ""}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close hut details"
        >
          <X />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2">
          {usable ? (
            <Badge variant="secondary">{hut.kind === "bivouac" ? "Unguarded bivouac" : "Staffed hut"}</Badge>
          ) : (
            <Badge variant="destructive">Not usable</Badge>
          )}
          {hut.beds ? (
            <Badge variant="outline">
              {hut.beds} bed{hut.beds === 1 ? "" : "s"}
            </Badge>
          ) : null}
          <span className="self-center text-xs text-muted-foreground">{hut.operator}</span>
        </div>

        {!usable && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Do not plan a night here. The note below is why, and it can change — check the homepage before you go.
          </p>
        )}

        <p className="text-sm leading-relaxed">{hut.notes}</p>

        <div className="grid grid-cols-1 gap-3 text-sm">
          <InfoRow icon={<MapPin className="size-4" />} label="Valley">
            {hub?.name}. Sleep in {hub?.sleep}.
          </InfoRow>
          <InfoRow icon={hut.kind === "bivouac" ? <Tent className="size-4" /> : <House className="size-4" />} label="Run by">
            {hut.operator}
            {hut.kind === "bivouac"
              ? ". No warden. First come, first served, and only if the shelter is intact."
              : ". Reservation is the safe assumption in the guarded season."}
          </InfoRow>
          {hut.phone && (
            <InfoRow icon={<Phone className="size-4" />} label="Phone">
              <a href={`tel:${hut.phone.replace(/\s/g, "")}`} className="hover:underline">
                {hut.phone}
              </a>
            </InfoRow>
          )}
          <InfoRow icon={<Mountain className="size-4" />} label="Summits from here">
            {peaks.length === 0 ? (
              "Not the named hut for a summit on the list."
            ) : (
              <span className="flex flex-wrap gap-1.5 pt-1">
                {peaks.map((peak) => (
                  <button
                    key={peak.id}
                    type="button"
                    onClick={() => onOpenPeak(peak.id)}
                    className="rounded-full border px-2 py-0.5 text-xs hover:bg-muted"
                  >
                    {peak.name}
                  </button>
                ))}
              </span>
            )}
          </InfoRow>
        </div>

        <Separator />

        <div>
          <h3 className="font-heading mb-2 text-base">Homepage, booking, maps</h3>
          <ul className="flex flex-col gap-1.5">
            {hutLinks(hut).map((link) => (
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

export function HutDetail({
  hut,
  onClose,
  onOpenPeak,
  onBack,
  backLabel,
}: {
  hut: Hut | null;
  onClose: () => void;
  onOpenPeak: (id: string) => void;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <Sheet open={Boolean(hut)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full overflow-hidden p-0 sm:max-w-md"
      >
        {hut && (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>{hut.name}</SheetTitle>
              <SheetDescription>
                {hut.elevation.toLocaleString("en")} m · {countryLabel(hut.countries)}
              </SheetDescription>
            </SheetHeader>
            <HutInfo
              key={hut.id}
              hut={hut}
              onClose={onClose}
              onOpenPeak={onOpenPeak}
              onBack={onBack}
              backLabel={backLabel}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
