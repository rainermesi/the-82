import type { Combo } from "./types";

export const COMBOS: Combo[] = [
  {
    id: "mb-gouter",
    name: "Goûter / Trois Monts",
    hubId: "chamonix",
    days: 3,
    grade: "PD+",
    season: "either",
    blurb:
      "The trade route onto Mont Blanc. Goûter or Trois Monts bags Mont Blanc, Courmayeur, Dôme du Goûter, Maudit and Tacul in one weather window. Add the Aiguilles du Diable only if you want a hard rock day off Tacul.",
  },
  {
    id: "mb-diable",
    name: "Aiguilles du Diable",
    hubId: "chamonix",
    days: 2,
    grade: "D",
    season: "summer-only",
    blurb:
      "Five 4000er gendarmes on Tacul’s SE ridge. One long rock day from the Cosmiques or a bivouac. Combine with a Tacul/Maudit ski or glacier day only if the team is solid at D.",
  },
  {
    id: "mb-peuterey",
    name: "Innominata / Peuterey satellites",
    hubId: "chamonix",
    days: 4,
    grade: "D",
    season: "summer-only",
    blurb:
      "Picco Luigi Amedeo, Grand Pilier d’Angle, Aiguille Blanche, Mont Brouillard and Punta Baretti. Serious mixed terrain on the Italian side. Plan as its own expedition from Eccles or Monzino, not as a Chamonix add-on.",
  },
  {
    id: "mb-jorasses",
    name: "Grandes Jorasses traverse",
    hubId: "chamonix",
    days: 3,
    grade: "D",
    season: "summer-only",
    blurb:
      "Walker, Whymper, Croz, Marguerite and Elena. The full ridge is a two-day D; Walker alone from the hut is AD. Do this when you are already based in Chamonix with a good forecast, not on a first 4000er trip.",
  },
  {
    id: "mb-rochefort",
    name: "Rochefort–Géant",
    hubId: "chamonix",
    days: 2,
    grade: "AD",
    season: "summer-only",
    blurb:
      "Dent du Géant plus Aiguille and Dôme de Rochefort from Torino/Helbronner. Géant is a short rock day (bolts); the Rochefort arete is a classic snow/ice ridge. Very efficient from the skyway.",
  },
  {
    id: "mb-verte",
    name: "Verte–Droites",
    hubId: "chamonix",
    days: 4,
    grade: "AD+",
    season: "summer-only",
    blurb:
      "Aiguille Verte, Grande Rocheuse, Aiguille du Jardin and Les Droites. Couvercle hut is the usual base. These are not ski 4000ers; treat them as a dedicated mixed week.",
  },
  {
    id: "mb-bionnassay",
    name: "Aiguille de Bionnassay",
    hubId: "chamonix",
    days: 2,
    grade: "AD-",
    season: "summer-first",
    blurb:
      "Often combined with a Mont Blanc traverse (Miage–Bionnassay–Goûter). A sharp snow arete; better in summer than as a ski.",
  },
  {
    id: "rosa-traverse",
    name: "Monte Rosa high traverse",
    hubId: "alagna",
    days: 3,
    grade: "AD-",
    season: "either",
    blurb:
      "From Gnifetti or Capanna Margherita: Giordani, Vincent, Schwarzhorn, Ludwigshöhe, Parrotspitze, Signalkuppe, then Zumstein, Dufour and Nordend. The single best peaks-per-day objective on the list if you are happy on PD+/AD- glaciers.",
  },
  {
    id: "lyskamm",
    name: "Lyskamm traverse",
    hubId: "zermatt",
    days: 2,
    grade: "AD",
    season: "summer-first",
    blurb:
      "East and west summits on a spectacular snow arete. Approach from Quintino Sella or Gnifetti. Skiable but usually done in summer. Pairs with Castor/Pollux from the same huts.",
  },
  {
    id: "twins",
    name: "Castor & Pollux",
    hubId: "zermatt",
    days: 2,
    grade: "PD+",
    season: "ski-first",
    blurb:
      "The Twins. Pollux is a short mixed scramble; Castor is a glacier peak and a superb ski. Felikjoch / Quintino Sella / Ayas. Easy to pair with the Breithorn traverse.",
  },
  {
    id: "breithorn-traverse",
    name: "Breithorn traverse",
    hubId: "zermatt",
    days: 1,
    grade: "PD+",
    season: "ski-first",
    blurb:
      "Five UIAA 4000ers in one day from Klein Matterhorn: West, Central, East, Gendarm and Roccia Nera. The highest-yield logistics day in the Alps. West summit alone is F and a classic first ski 4000er.",
  },
  {
    id: "matterhorn",
    name: "Matterhorn",
    hubId: "zermatt",
    days: 2,
    grade: "AD",
    season: "summer-only",
    blurb:
      "Hörnli or Lion ridge. Its own hut night and its own weather window. Do not pack other 4000ers around it in the same days — recover, then use the rest of the week on the Breithorn/Twins.",
  },
  {
    id: "weisshorn-bishorn",
    name: "Weisshorn & Bishorn",
    hubId: "zermatt",
    days: 3,
    grade: "AD",
    season: "summer-first",
    blurb:
      "Bishorn is PD and a fine ski 4000er from Tracuit. Weisshorn east ridge from the Weisshorn hut is AD and a full day. Same massif, different character — many people ski Bishorn in spring and save Weisshorn for summer.",
  },
  {
    id: "zinal-4000",
    name: "Zinal 4000ers",
    hubId: "zermatt",
    days: 5,
    grade: "AD",
    season: "summer-only",
    blurb:
      "Dent Blanche, Dent d’Hérens, Zinalrothorn and Ober Gabelhorn. Four separate hut approaches (Dent Blanche, Arolla/Prarayer, Mountet, Rothorn). A full Valais week from Zinal/Zermatt, not a single traverse.",
  },
  {
    id: "nadelgrat",
    name: "Nadelgrat",
    hubId: "saas-fee",
    days: 2,
    grade: "PD+",
    season: "summer-first",
    blurb:
      "Nadelhorn, Lenzspitze, Stecknadelhorn, Hohberghorn, Dürrenhorn from the Mischabel hut. The classic Mischabel ridge. Lenzspitze is often done with Nadelhorn; Dürrenhorn is the extra walk.",
  },
  {
    id: "dom-taesch",
    name: "Dom & Täschhorn",
    hubId: "saas-fee",
    days: 3,
    grade: "AD-",
    season: "summer-first",
    blurb:
      "Dom from the Dom hut is the highest peak entirely in Switzerland (PD). Täschhorn is a step up (AD) from Mischabeljoch bivouac. Two hut nights if you want both.",
  },
  {
    id: "saas-south",
    name: "Allalin–Alphubel–Strahlhorn",
    hubId: "saas-fee",
    days: 3,
    grade: "PD",
    season: "ski-first",
    blurb:
      "Allalinhorn (lift-assisted F/PD-), Alphubel, Rimpfischhorn and Strahlhorn. The best spring-ski cluster after the Breithorn. Britannia hut is the hub. In summer they are still short glacier days.",
  },
  {
    id: "weissmies-group",
    name: "Weissmies & Lagginhorn",
    hubId: "saas-fee",
    days: 2,
    grade: "PD-",
    season: "ski-first",
    blurb:
      "From Hohsaas: Weissmies NW flank and Lagginhorn W ridge, both PD-. Excellent first 4000ers and good ski tours. Do them on the same Saas-Fee week as Allalin.",
  },
  {
    id: "combin-trio",
    name: "Grand Combin trio",
    hubId: "combin",
    days: 3,
    grade: "PD+",
    season: "ski-first",
    blurb:
      "Grafeneire (the main summit) is a classic ski 4000er. Valsorey and Tsessette are close enough to add in summer from Valsorey hut if the ridge is in condition.",
  },
  {
    id: "berner-train",
    name: "Jungfrau & Mönch",
    hubId: "jungfrau",
    days: 2,
    grade: "PD",
    season: "either",
    blurb:
      "Jungfraujoch train access. Mönch is the friendlier day (PD-) and a reasonable ski. Jungfrau is a longer glacier/ridge day. Perfect for a short Bernese window or bad-weather consolation.",
  },
  {
    id: "berner-konkordia",
    name: "Konkordia 4000ers",
    hubId: "jungfrau",
    days: 5,
    grade: "PD+",
    season: "either",
    blurb:
      "Finsteraarhorn, Aletschhorn, Gross and Hinter Fiescherhorn, Grünhorn. Base at Konkordiahütte or Finsteraarhornhütte. Aletschhorn is a superb ski; Finsteraarhorn is the independent giant of the Oberland.",
  },
  {
    id: "berner-schreck",
    name: "Schreckhorn & Lauteraarhorn",
    hubId: "jungfrau",
    days: 3,
    grade: "AD",
    season: "summer-only",
    blurb:
      "The hard Bernese pair. Schreckhorn hut, mixed rock. Not ski peaks. Save for a dedicated summer visit after the Konkordia glacier 4000ers are done.",
  },
  {
    id: "paradiso",
    name: "Gran Paradiso",
    hubId: "paradiso",
    days: 2,
    grade: "PD-",
    season: "ski-first",
    blurb:
      "The textbook first 4000er and the best first ski four-thousander. One hut night at Vittorio Emanuele II. Pair with a drive to Combin or a Turin long weekend — do not spend a whole Alps holiday on this alone.",
  },
  {
    id: "ecrins-pair",
    name: "Écrins pair",
    hubId: "ecrins",
    days: 3,
    grade: "PD+",
    season: "summer-first",
    blurb:
      "Barre des Écrins and Dôme de Neige from the Écrins hut. Dôme is the easier snow dome; the Barre is a short rock/snow ridge beyond. One trip, two ticks, long transfer from the rest of the Alps.",
  },
  {
    id: "bernina",
    name: "Piz Bernina",
    hubId: "bernina",
    days: 2,
    grade: "PD+",
    season: "summer-first",
    blurb:
      "Spallagrat (PD+) from Marco e Rosa, or the Biancograt (AD) from Tschierva. One peak at the far eastern edge of the list. Make a long weekend of it in the Engadin.",
  },
];

export const COMBO_BY_ID = Object.fromEntries(COMBOS.map((c) => [c.id, c]));
