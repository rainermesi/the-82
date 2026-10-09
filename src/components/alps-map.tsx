"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HUBS } from "@/data/hubs";
import { PEAKS } from "@/data/peaks";
import type { Peak } from "@/data/types";
import { useProgress } from "./progress-provider";
import { SEASON_COLOR } from "./peak-meta";

function FlyTo({ peak }: { peak: Peak | null }) {
  const map = useMap();
  useEffect(() => {
    if (!peak) return;
    map.flyTo([peak.lat, peak.lon], Math.max(map.getZoom(), 12), { duration: 0.8 });
  }, [peak, map]);
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
  onSelect,
}: {
  peaks: Peak[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { isClimbed } = useProgress();
  const [zoom, setZoom] = useState(7);
  const selected = PEAKS.find((p) => p.id === selectedId) ?? null;

  const hubCounts = useMemo(() => {
    return HUBS.map((hub) => {
      const hubPeaks = peaks.filter((p) => p.hubId === hub.id);
      return { hub, count: hubPeaks.length, remaining: hubPeaks.filter((p) => !isClimbed(p.id)).length };
    }).filter((h) => h.count > 0);
  }, [peaks, isClimbed]);

  const showHubs = zoom < 9;

  return (
    <MapContainer
      center={[45.95, 7.4]}
      zoom={7}
      className="h-full w-full rounded-xl"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      />
      <ZoomWatcher onZoom={setZoom} />
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
              click: () => {
                const first = peaks.find((p) => p.hubId === hub.id);
                if (first) onSelect(first.id);
              },
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
