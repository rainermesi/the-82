"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { PEAKS } from "@/data/peaks";
import type { ProgressMap } from "@/data/types";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeProgress,
  writeProgress,
} from "@/lib/progress";

type ProgressContextValue = {
  progress: ProgressMap;
  ready: boolean;
  climbed: number;
  remaining: number;
  isClimbed: (id: string) => boolean;
  markClimbed: (id: string, climbedAt?: string, notes?: string) => void;
  markUnclimbed: (id: string) => void;
  replaceProgress: (next: ProgressMap) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );

  const markClimbed = useCallback((id: string, climbedAt?: string, notes?: string) => {
    writeProgress({
      ...getProgressSnapshot(),
      [id]: {
        climbedAt: climbedAt ?? new Date().toISOString().slice(0, 10),
        notes,
      },
    });
  }, []);

  const markUnclimbed = useCallback((id: string) => {
    const next = { ...getProgressSnapshot() };
    delete next[id];
    writeProgress(next);
  }, []);

  const value = useMemo<ProgressContextValue>(() => {
    const climbed = PEAKS.filter((p) => progress[p.id]).length;
    return {
      progress,
      ready: true,
      climbed,
      remaining: PEAKS.length - climbed,
      isClimbed: (id) => Boolean(progress[id]),
      markClimbed,
      markUnclimbed,
      replaceProgress: writeProgress,
      reset: () => writeProgress({}),
    };
  }, [progress, markClimbed, markUnclimbed]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
