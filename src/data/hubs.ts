import type { Hub } from "./types";

export const HUBS: Hub[] = [
  {
    id: "chamonix",
    name: "Chamonix–Courmayeur",
    shortName: "Chamonix",
    region: "Mont Blanc massif",
    lat: 45.9237,
    lon: 6.8694,
    fly: "Geneva (GVA), 1 hr",
    sleep: "Chamonix or Courmayeur",
    bestMonths: "Jul–Sep; ski Mar–May",
    blurb:
      "The densest cluster on the list: 28 of the 82. One valley system, two countries, lifts into several distinct ridges. Split trips by sub-range (Trois Monts, Verte, Jorasses–Rochefort, Peuterey) rather than trying to do the massif in one hit.",
  },
  {
    id: "zermatt",
    name: "Zermatt–Cervinia",
    shortName: "Zermatt",
    region: "Pennine Alps (west)",
    lat: 46.0207,
    lon: 7.7491,
    fly: "Geneva, Zurich, or Milan + train",
    sleep: "Zermatt, Cervinia, or Zinal",
    bestMonths: "Jul–Sep; ski Mar–May on Breithorn–Twins",
    blurb:
      "Matterhorn country plus the Breithorn traverse, Castor/Pollux, Lyskamm, and the Zinal 4000ers. Klein Matterhorn lift makes the easy glacier peaks extremely efficient; the north-face classics (Weisshorn, Dent Blanche) need separate hut days.",
  },
  {
    id: "saas-fee",
    name: "Saas-Fee–Randa",
    shortName: "Saas-Fee",
    region: "Mischabel & Weissmies",
    lat: 46.1085,
    lon: 7.9277,
    fly: "Geneva or Zurich + train to Visp",
    sleep: "Saas-Fee, Saas-Grund, or Randa",
    bestMonths: "Jul–Sep; ski Mar–May on Allalin–Alphubel–Strahlhorn",
    blurb:
      "Highest density of ‘baggable’ 4000ers after Mont Blanc. Nadelgrat, Dom–Täschhorn, the Allalin group, and Weissmies–Lagginhorn are all day-trip or one-hut objectives from the Saastal. Combine with Zermatt in a two-week Valais block.",
  },
  {
    id: "alagna",
    name: "Alagna–Gressoney",
    shortName: "Alagna",
    region: "Monte Rosa (Italian side)",
    lat: 45.854,
    lon: 7.937,
    fly: "Milan (MXP) or Turin",
    sleep: "Alagna, Gressoney-La-Trinité, or Staffal",
    bestMonths: "Jul–Sep; ski Apr–May",
    blurb:
      "The efficient way to harvest the Monte Rosa 4000ers. Gnifetti and Margherita huts sit on the ridge; a single high camp can yield Giordani through Signalkuppe, with Zumstein, Dufour and Nordend as extras. Swiss approach from the Monte Rosa Hut is longer.",
  },
  {
    id: "combin",
    name: "Bourg-Saint-Pierre",
    shortName: "Grand Combin",
    region: "Grand Combin",
    lat: 45.949,
    lon: 7.209,
    fly: "Geneva, then Martigny",
    sleep: "Bourg-Saint-Pierre or Aosta valley",
    bestMonths: "Jun–Sep; ski Mar–May",
    blurb:
      "Three 4000ers on one mountain. The Valsorey Hut is the usual high camp; Grafeneire is a classic ski 4000er, with Valsorey and Tsessette added in summer on the same trip if conditions allow.",
  },
  {
    id: "jungfrau",
    name: "Grindelwald–Jungfraujoch",
    shortName: "Jungfrau",
    region: "Bernese Alps",
    lat: 46.6244,
    lon: 8.0342,
    fly: "Zurich or Geneva + train",
    sleep: "Grindelwald, Lauterbrunnen, or Fiesch",
    bestMonths: "Jul–Sep; ski Apr–May on Mönch and Aletschhorn",
    blurb:
      "Nine 4000ers around Konkordiaplatz. Jungfraujoch train puts Mönch and Jungfrau in range as short trips; Finsteraarhorn, the Fiescherhorns, Grünhorn and Aletschhorn want a Konkordia or Finsteraarhorn hut stay. Schreckhorn and Lauteraarhorn are a separate, harder pair.",
  },
  {
    id: "paradiso",
    name: "Valsavarenche",
    shortName: "Gran Paradiso",
    region: "Graian Alps",
    lat: 45.525,
    lon: 7.201,
    fly: "Turin or Geneva",
    sleep: "Pont or Valsavarenche",
    bestMonths: "Mar–May ski; Jun–Sep on foot",
    blurb:
      "A single isolated 4000er and the classic first Alpine four-thousander. Vittorio Emanuele II hut, straightforward glacier, and outstanding as a spring ski tour. Pair it with a Combin or early Chamonix week, not as its own flight.",
  },
  {
    id: "ecrins",
    name: "Écrins (Ailefroide)",
    shortName: "Écrins",
    region: "Dauphiné Alps",
    lat: 44.891,
    lon: 6.445,
    fly: "Grenoble, Lyon, or Turin",
    sleep: "Ailefroide or La Bérarde",
    bestMonths: "Jun–Sep",
    blurb:
      "The southern outlier: Barre des Écrins and Dôme de Neige, 100 km from the next 4000er. Worth a dedicated long weekend from the Écrins hut. Do not bolt this onto a Chamonix week — the drive and weather window are separate.",
  },
  {
    id: "bernina",
    name: "Pontresina",
    shortName: "Bernina",
    region: "Bernina Group",
    lat: 46.4908,
    lon: 9.9042,
    fly: "Zurich, then train to St. Moritz",
    sleep: "Pontresina or Diavolezza",
    bestMonths: "Jul–Sep; ski possible in spring",
    blurb:
      "The easternmost 4000er. Piz Bernina via the Biancograt or Spallagrat from Marco e Rosa hut. One peak, but a full trip — combine with a walking holiday in the Engadin rather than a Valais 4000er binge.",
  },
];

export const HUB_BY_ID = Object.fromEntries(HUBS.map((h) => [h.id, h]));
