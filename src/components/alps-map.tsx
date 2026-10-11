"use client";

import { useEffect, useMemo, useState } from "react";
import { divIcon, latLngBounds } from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HUT_CLOSED_COLOR, HUT_COLOR, HUTS } from "@/data/huts";
import { HUB_BY_ID, HUBS } from "@/data/hubs";
import { PEAKS } from "@/data/peaks";
import type { Peak } from "@/data/types";
import { hutsForHub, peaksForHut } from "@/lib/huts";
import { useProgress } from "./progress-provider";
import { SEASON_COLOR } from "./peak-meta";

const ALPS_CENTER: [number, number] = [45.95, 7.4];
const ALPS_ZOOM = 7;
const CLUSTER_ZOOM = 11;

function hubPeaks(peaks: Peak[], hubId: string) {
  return peaks.filter((p) => p.hubId === hubId);
}

function viewForHub(peaks: Peak[], hubId: string | null) {
  if (!hubId) return { center: ALPS_CENTER, zoom: ALPS_ZOOM };
  const pts = hubPeaks(peaks, hubId);
  const hub = HUB_BY_ID[hubId];
  if (pts.length === 1) return { center: [pts[0].lat, pts[0].lon] as [number, number], zoom: 12 };
  if (hub) return { center: [hub.lat, hub.lon] as [number, number], zoom: CLUSTER_ZOOM };
  return { center: ALPS_CENTER, zoom: ALPS_ZOOM };
}

function fitMapToHub(map: ReturnType<typeof useMap>, peaks: Peak[], hubId: string | null) {
  if (!hubId) {
    map.flyTo(ALPS_CENTER, ALPS_ZOOM, { duration: 0.8 });
    return;
  }
  const pts = hubPeaks(peaks, hubId);
  const huts = hutsForHub(hubId);
  const coords = [
    ...pts.map((p) => [p.lat, p.lon] as [number, number]),
    ...huts.map((h) => [h.lat, h.lon] as [number, number]),
  ];
  if (coords.length >= 2) {
    const bounds = latLngBounds(coords);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12, animate: true, duration: 0.8 });
    return;
  }
  if (coords.length === 1) {
    map.flyTo(coords[0], 12, { duration: 0.8 });
    return;
  }
  const hub = HUB_BY_ID[hubId];
  if (hub) map.flyTo([hub.lat, hub.lon], CLUSTER_ZOOM, { duration: 0.8 });
}

function FlyTo({
  lat,
  lon,
  token,
}: {
  lat: number | null;
  lon: number | null;
  token: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (lat == null || lon == null || !token) return;
    map.flyTo([lat, lon], Math.max(map.getZoom(), 12), { duration: 0.8 });
  }, [lat, lon, token, map]);
  return null;
}

function hutMarkerIcon(selected: boolean, usable: boolean) {
  const size = selected ? 16 : 12;
  const fill = usable ? HUT_COLOR : HUT_CLOSED_COLOR;
  const border = selected ? "#111111" : "#f6f1ea";
  return divIcon({
    className: "hut-marker",
    iconSize: [28, 28],
    iconAnchor: [0, 0],
    html: `<span style="display:block;width:28px;height:28px"><span style="display:block;width:${size}px;height:${size}px;margin-left:8px;margin-top:8px;background:${fill};border:2px solid ${border};transform:rotate(45deg);border-radius:1px"></span></span>`,
  });
}

function FitToHub({
  hubId,
  requestId,
  peaks,
}: {
  hubId: string | null;
  requestId: number;
  peaks: Peak[];
}) {
  const map = useMap();
  useEffect(() => {
    if (requestId === 0 && !hubId) return;
    const id = window.setTimeout(() => {
      map.invalidateSize();
      fitMapToHub(map, peaks, hubId);
    }, 80);
    return () => window.clearTimeout(id);
  }, [hubId, requestId, peaks, map]);
  return null;
}

function InvalidateOnSelect({ token }: { token: string }) {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 60);
    return () => window.clearTimeout(id);
  }, [token, map]);
  return null;
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const update = () => onZoom(map.getZoom());
    update();
    map.on("zoomend", update);
    return () => {
      map.off("zoomend", update);
    };
  }, [map, onZoom]);
  return null;
}

export function AlpsMap({
  peaks,
  selectedId,
  selectedHutId,
  showHuts,
  focusHubId,
  focusRequestId,
  onSelect,
  onSelectHut,
  onFocusHub,
}: {
  peaks: Peak[];
  selectedId: string | null;
  selectedHutId: string | null;
  showHuts: boolean;
  focusHubId: string | null;
  focusRequestId: number;
  onSelect: (id: string) => void;
  onSelectHut: (id: string) => void;
  onFocusHub: (hubId: string) => void;
}) {
  const { isClimbed } = useProgress();
  const [zoom, setZoom] = useState(
    selectedHutId || selectedId ? 12 : focusHubId ? CLUSTER_ZOOM : ALPS_ZOOM,
  );
  const selected = PEAKS.find((p) => p.id === selectedId) ?? null;
  const selectedHut = HUTS.find((h) => h.id === selectedHutId) ?? null;
  const hutIcons = useMemo(() => {
    const icons = new Map<string, ReturnType<typeof divIcon>>();
    for (const hut of HUTS) {
      const usable = hut.usable !== false;
      icons.set(`${hut.id}:0`, hutMarkerIcon(false, usable));
      icons.set(`${hut.id}:1`, hutMarkerIcon(true, usable));
    }
    return icons;
  }, []);
  const fly = selectedHut
    ? { lat: selectedHut.lat, lon: selectedHut.lon, token: `hut:${selectedHut.id}` }
    : selected
      ? { lat: selected.lat, lon: selected.lon, token: `peak:${selected.id}` }
      : { lat: null, lon: null, token: null };
  const start = selectedHut
    ? { center: [selectedHut.lat, selectedHut.lon] as [number, number], zoom: 12 }
    : selected
      ? { center: [selected.lat, selected.lon] as [number, number], zoom: 12 }
      : viewForHub(peaks, focusHubId);

  const hubCounts = useMemo(() => {
    return HUBS.map((hub) => {
      const hubPeaks = peaks.filter((p) => p.hubId === hub.id);
      return { hub, count: hubPeaks.length, remaining: hubPeaks.filter((p) => !isClimbed(p.id)).length };
    }).filter((h) => h.count > 0);
  }, [peaks, isClimbed]);

  const showHubs = zoom < 9;

  return (
    <MapContainer
      center={start.center}
      zoom={start.zoom}
      className="h-full w-full rounded-xl"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      />
      <ZoomWatcher onZoom={setZoom} />
      <InvalidateOnSelect token={`${selectedId ?? ""}:${selectedHutId ?? ""}`} />
      <FitToHub hubId={focusHubId} requestId={focusRequestId} peaks={peaks} />
      <FlyTo lat={fly.lat} lon={fly.lon} token={fly.token} />

      {showHubs &&
        hubCounts.map(({ hub, remaining, count }) => (
          <CircleMarker
            key={hub.id}
            center={[hub.lat, hub.lon]}
            radius={10 + remaining * 0.35}
            pathOptions={{
              color: "#1f3b4d",
              fillColor: "#3d7ea6",
              fillOpacity: 0.55,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onFocusHub(hub.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div className="text-xs">
                <strong>{hub.shortName}</strong>
                <div>
                  {remaining} remaining of {count} in view
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

      {!showHubs &&
        peaks.map((peak) => {
          const climbed = isClimbed(peak.id);
          const selectedPeak = peak.id === selectedId;
          return (
            <CircleMarker
              key={peak.id}
              center={[peak.lat, peak.lon]}
              radius={selectedPeak ? 10 : 6}
              pathOptions={{
                color: selectedPeak ? "#111" : climbed ? "#6b7280" : "#1f2937",
                fillColor: climbed ? "#9ca3af" : SEASON_COLOR[peak.season],
                fillOpacity: climbed ? 0.45 : 0.9,
                weight: selectedPeak ? 3 : 1,
              }}
              eventHandlers={{ click: () => onSelect(peak.id) }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                <div className="text-xs">
                  <strong>{peak.name}</strong> {peak.elevation} m
                  <div>
                    {climbed ? "Climbed" : peak.grade} · {peak.massif}
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

      {showHuts &&
        !showHubs &&
        HUTS.map((hut) => {
          const usable = hut.usable !== false;
          const selectedMarker = hut.id === selectedHutId;
          const served = peaksForHut(hut.id).length;
          const icon = hutIcons.get(`${hut.id}:${selectedMarker ? 1 : 0}`);
          if (!icon) return null;
          return (
            <Marker
              key={hut.id}
              position={[hut.lat, hut.lon]}
              icon={icon}
              zIndexOffset={selectedMarker ? 800 : 200}
              eventHandlers={{ click: () => onSelectHut(hut.id) }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <div className="text-xs">
                  <strong>{hut.name}</strong> {hut.elevation} m
                  <div>
                    {usable ? (hut.kind === "bivouac" ? "Bivouac" : "Hut") : "Not usable"}
                    {hut.beds ? ` · ${hut.beds} beds` : ""}
                    {served > 0 ? ` · ${served} summit${served === 1 ? "" : "s"}` : ""}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
    </MapContainer>
  );
}
