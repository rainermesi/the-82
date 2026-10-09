import type { Link, Peak } from "@/data/types";

export function peakLinks(peak: Peak): Link[] {
  const q = encodeURIComponent(peak.name);
  const links: Link[] = [];

  if (peak.summitpost) {
    links.push({ label: "SummitPost", url: peak.summitpost });
  }

  links.push(
    { label: "Wikipedia", url: peak.wikipedia },
    {
      label: "Camptocamp",
      url: `https://www.camptocamp.org/search?q=${q}&t=s`,
    },
    {
      label: "Hikr",
      url: `https://www.hikr.org/search.php?search_term=${q}`,
    },
    {
      label: "OpenStreetMap",
      url: `https://www.openstreetmap.org/?mlat=${peak.lat}&mlon=${peak.lon}#map=16/${peak.lat}/${peak.lon}`,
    },
  );

  if (peak.countries.includes("CH")) {
    links.push({
      label: "SwissTopo",
      url: `https://map.geo.admin.ch/#/map?lang=en&center=${peak.lon},${peak.lat}&z=11&bgLayer=ch.swisstopo.pixelkarte-farbe&crosshair=marker`,
    });
  }

  if (peak.countries.includes("FR")) {
    links.push({
      label: "Géoportail",
      url: `https://www.geoportail.gouv.fr/carte?c=${peak.lon},${peak.lat}&z=15`,
    });
  }

  return links;
}

export const GLOBAL_LINKS: Link[] = [
  {
    label: "UIAA 82 list",
    url: "https://www.theuiaa.org/4000-alps/",
  },
  {
    label: "UIAA 1994 PDF",
    url: "https://www.theuiaa.org/documents/mountaineering/UIAA_MOUNTAINEERING_4000ERS.pdf",
  },
  {
    label: "SummitPost Alpine 4000ers",
    url: "https://www.summitpost.org/alpine-4000m-peaks/170861",
  },
  {
    label: "Wikipedia: Alpine 4000ers",
    url: "https://en.wikipedia.org/wiki/List_of_mountains_of_the_Alps_over_4000_metres",
  },
];
