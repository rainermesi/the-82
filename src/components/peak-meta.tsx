import { Badge } from "@/components/ui/badge";
import type { Peak, SeasonFit } from "@/data/types";
import { SEASON_LABEL } from "@/lib/grades";

export const SEASON_COLOR: Record<SeasonFit, string> = {
  "ski-first": "#3d7ea6",
  either: "#2f6b5a",
  "summer-first": "#c4843a",
  "summer-only": "#b4532a",
};

export function countryLabel(countries: Peak["countries"]) {
  const names = { CH: "Switzerland", FR: "France", IT: "Italy" };
  return countries.map((c) => names[c]).join(" / ");
}

export function SeasonBadge({ season }: { season: SeasonFit }) {
  return (
    <Badge
      variant="outline"
      className="border-transparent text-white"
      style={{ background: SEASON_COLOR[season] }}
    >
      {SEASON_LABEL[season]}
    </Badge>
  );
}

export function GradeBadge({ grade }: { grade: string }) {
  return <Badge variant="secondary">{grade}</Badge>;
}
