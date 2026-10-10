import { HUTS } from "@/data/huts";
import { PEAKS } from "@/data/peaks";
import type { Hut, Peak } from "@/data/types";

const LETTER = /[\p{L}\p{N}]/u;

export type HutSegment = {
  text: string;
  hut: Hut | null;
};

const ALIASES = HUTS.flatMap((hut) =>
  hut.aliases.map((alias) => ({ hut, alias, lower: alias.toLowerCase() })),
).sort((a, b) => b.lower.length - a.lower.length);

/** Split a peak's hut sentence into plain text and known huts. Longest alias wins. */
export function segmentHutLabel(label: string): HutSegment[] {
  const lower = label.toLowerCase();
  const parts: HutSegment[] = [];
  let i = 0;

  while (i < label.length) {
    const hit = ALIASES.find(({ lower: alias }) => {
      if (!lower.startsWith(alias, i)) return false;
      const prev = i === 0 ? "" : lower[i - 1];
      const next = lower[i + alias.length] ?? "";
      if (prev && LETTER.test(prev)) return false;
      if (next && LETTER.test(next)) return false;
      return true;
    });

    if (hit) {
      parts.push({ text: label.slice(i, i + hit.alias.length), hut: hit.hut });
      i += hit.alias.length;
      continue;
    }

    const last = parts[parts.length - 1];
    if (last && !last.hut) last.text += label[i];
    else parts.push({ text: label[i], hut: null });
    i += 1;
  }

  return parts;
}

export function peaksForHut(hutId: string): Peak[] {
  return PEAKS.filter((peak) =>
    segmentHutLabel(peak.hut).some((part) => part.hut?.id === hutId),
  ).sort((a, b) => a.rank - b.rank);
}

export function hutsForHub(hubId: string): Hut[] {
  return HUTS.filter(
    (hut) => hut.hubId === hubId || peaksForHut(hut.id).some((peak) => peak.hubId === hubId),
  );
}
