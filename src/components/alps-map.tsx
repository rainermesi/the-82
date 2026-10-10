"use client";

import { useEffect, useMemo, useState } from "react";
import { latLngBounds } from "leaflet";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HUB_BY_ID, HUBS } from "@/data/hubs";
import { PEAKS } from "@/data/peaks";
import type { Peak } from "@/data/types";
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
  if (pts.length >= 2) {
    const bounds = latLngBounds(pts.map((p) => [p.lat, p.lon] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12, animate: true, duration: 0.8 });
    return;
  }
  if (pts.length === 1) {
    map.flyTo([pts[0].lat, pts[0].lon], 12, { duration: 0.8 });
    return;
  }
  const hub = HUB_BY_ID[hubId];
  if (hub) map.flyTo([hub.lat, hub.lon], CLUSTER_ZOOM, { duration: 0.8 });
}

function FlyTo({ peak }: { peak: Peak | null }) {
  const map = useMap();
  useEffect(() => {
    if (!peak) return;
    map.flyTo([peak.lat, peak.lon], Math.max(map.getZoom(), 12), { duration: 0.8 });
  }, [peak, map]);
  return null;
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

function InvalidateOnSelect({ selectedId }: { selectedId: string | null }) {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 60);
    return () => window.clearTimeout(id);
  }, [selectedId, map]);
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
  focusHubId,
  focusRequestId,
  onSelect,
  onFocusHub,
}: {
  peaks: Peak[];
  selectedId: string | null;
  focusHubId: string | null;
  focusRequestId: number;
  onSelect: (id: string) => void;
  onFocusHub: (hubId: string) => void;
}) {
  const { isClimbed } = useProgress();
  const [zoom, setZoom] = useState(focusHubId ? CLUSTER_ZOOM : ALPS_ZOOM);
  const selected = PEAKS.find((p) => p.id === selectedId) ?? null;
  const start = viewForHub(peaks, focusHubId);

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
      <InvalidateOnSelect selectedId={selectedId} />
      <FitToHub hubId={focusHubId} requestId={focusRequestId} peaks={peaks} />
      <FlyTo peak={selected} />

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
    </MapContainer>
  );
}
