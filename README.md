# The 82

A lifetime planner for the **82 official UIAA 4000-metre peaks of the Alps**.

The list is the 1994 UIAA / Club Alpino Italiano classification — the one alpinists mean when they talk about “doing the 4000ers.” Use the app to see where the peaks cluster, pack yearly trips by valley, split spring ski tours from summer rock, and keep a personal tick-list.

## What it does

- **Clusters** — nine logistics basins (Chamonix, Zermatt, Saas-Fee, Alagna, Combin, Jungfrau, Gran Paradiso, Écrins, Bernina), not 82 separate holidays.
- **Map** — OpenTopoMap of every summit and the huts used to climb them. Zoom out for valley clusters; zoom in for peaks, coloured by season, and for hut markers with a detail view.
- **Yearly trips** — given how many days you have and a max alpine grade, packs remaining peaks into ridge traverses (Nadelgrat, Breithorn, Monte Rosa, Trois Monts, …).
- **Winter vs summer** — which 4000ers are classic spring ski tours, which are summer-only rock/mixed, and which work either way.
- **Documents** — SummitPost (where a page exists), Wikipedia, Camptocamp search, Hikr, OpenStreetMap, SwissTopo / Géoportail, plus hut homepages and booking pages.
- **Progress** — mark peaks climbed. Stored in this browser only; export/import JSON if you want a backup.

This is a planning aid, not a guidebook. Always check current conditions, hut bookings, and a current topo before you go.

## View on the web

Once GitHub Actions is the Pages source, the app is at [rainermesi.github.io/the-82](https://rainermesi.github.io/the-82/).

If that URL shows this README instead of the planner, Pages is still set to **Deploy from a branch** (Jekyll). Change it:

1. Open [github.com/rainermesi/the-82/settings/pages](https://github.com/rainermesi/the-82/settings/pages)
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”)
3. Push `main` so `.github/workflows/github-pages.yml` is on GitHub, then check [Actions](https://github.com/rainermesi/the-82/actions)

```bash
git remote add github https://github.com/rainermesi/the-82.git
git pull github main --no-rebase
git push github main
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43123](http://localhost:43123).

```bash
npm run build
npm start
```

`npm run build` writes a static site to `out/`. `npm start` serves that folder.

## Deploy to GitHub Pages

The planner is a static export (`out/`). GitHub Pages must build it with the **GitHub Actions** workflow in `.github/workflows/github-pages.yml`. “Deploy from a branch” only publishes Jekyll’s rendering of this README — that is not the app.

## Data

| Source | Used for |
| --- | --- |
| [UIAA 4000 Alps](https://www.theuiaa.org/4000-alps/) | Official 82-peak list |
| [Wikipedia: Alpine 4000ers](https://en.wikipedia.org/wiki/List_of_mountains_of_the_Alps_over_4000_metres) | Elevations, prominence, normal routes |
| Wikidata | Summit coordinates |
| [SummitPost Alpine 4000ers](https://www.summitpost.org/alpine-4000m-peaks/170861) | Route-page links |

Season and trip-packing notes are editorial — typical practice for list-baggers, not a substitute for a local guide.

## Stack

Next.js, TypeScript, Tailwind, shadcn/ui, Leaflet / OpenTopoMap.
