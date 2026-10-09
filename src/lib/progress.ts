import type { ProgressMap } from "@/data/types";

export const PROGRESS_KEY = "the-82-progress-v1";

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap) {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function exportProgress(progress: ProgressMap) {
  return JSON.stringify(progress, null, 2);
}

export function parseProgress(raw: string): ProgressMap {
  const parsed = JSON.parse(raw) as ProgressMap;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid progress file");
  }
  return parsed;
}

const listeners = new Set<() => void>();
let cached: ProgressMap | null = null;

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeProgress(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgressSnapshot(): ProgressMap {
  if (cached) return cached;
  cached = loadProgress();
  return cached;
}

export function getServerProgressSnapshot(): ProgressMap {
  return {};
}

export function writeProgress(next: ProgressMap) {
  cached = next;
  if (typeof window !== "undefined") saveProgress(next);
  emit();
}
