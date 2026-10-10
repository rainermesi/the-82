# The 82

A lifetime planner for the **82 official UIAA 4000-metre peaks of the Alps**.

The list is the 1994 UIAA / Club Alpino Italiano classification — the one alpinists mean when they talk about “doing the 4000ers.” Use the app to see where the peaks cluster, pack yearly trips by valley, split spring ski tours from summer rock, and keep a personal tick-list.

## What it does

- **Clusters** — nine logistics basins (Chamonix, Zermatt, Saas-Fee, Alagna, Combin, Jungfrau, Gran Paradiso, Écrins, Bernina), not 82 separate holidays.
- **Map** — OpenTopoMap of every summit. Zoom out for valley clusters; zoom in for individual peaks, coloured by season.
- **Yearly trips** — given how many days you have and a max alpine grade, packs remaining peaks into ridge traverses (Nadelgrat, Breithorn, Monte Rosa, Trois Monts, …).
- **Winter vs summer** — which 4000ers are classic spring ski tours, which are summer-only rock/mixed, and which work either way.
- **Documents** — SummitPost (where a page exists), Wikipedia, Camptocamp search, Hikr, OpenStreetMap, SwissTopo / Géoportail.
- **Progress** — mark peaks climbed. Stored in this browser only; export/import JSON if you want a backup.

This is a planning aid, not a guidebook. Always check current conditions, hut bookings, and a current topo before you go.

## View on the web

Hosted on Github Pages @ [rainermesi.github.io/the-82/](https://rainermesi.github.io/the-82/)

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

Yes. The app has no server — progress stays in the browser — so GitHub Pages can host the `out/` export.

This repo’s default remote is Origin. Pages needs a **GitHub** repository:

1. Create a GitHub repo (public, or private with GitHub Pro / Team / Enterprise).
2. Push this project to it:

```bash
git remote add github https://github.com/<you>/<repo>.git
git push -u github main
```

3. In the GitHub repo: **Settings → Pages → Source: GitHub Actions**.
4. The workflow in `.github/workflows/github-pages.yml` builds on every push to `main` and publishes.

The site URL is `https://<you>.github.io/<repo>/` for a project repo, or `https://<you>.github.io/` if the repo is named `<you>.github.io`.

A project-pages URL includes the repo name as a path (`/the-82/…`). The workflow sets that automatically so CSS, JS, and the map still load.

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
