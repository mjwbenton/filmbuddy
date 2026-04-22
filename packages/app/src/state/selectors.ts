import type { AppState, Roll, Shot } from './types';

const DAY_MS = 1000 * 60 * 60 * 24;
export const BACKUP_STALE_DAYS = 15;

export function currentRoll(state: AppState, cameraId: string): Roll | null {
  const cam = state.cameras.find((c) => c.id === cameraId);
  if (!cam?.currentRollId) return null;
  return state.rolls.find((r) => r.id === cam.currentRollId) ?? null;
}

export function shotsForRoll(state: AppState, rollId: string): Shot[] {
  return state.shots.filter((s) => s.rollId === rollId).sort((a, b) => a.frame - b.frame);
}

export function latestShotForRoll(state: AppState, rollId: string): Shot | null {
  const ss = shotsForRoll(state, rollId);
  return ss.length > 0 ? (ss[ss.length - 1] ?? null) : null;
}

export function daysSince(ts: number | null, now: number = Date.now()): number {
  if (ts === null) return Infinity;
  return Math.floor((now - ts) / DAY_MS);
}

export function isBackupStale(state: AppState, now: number = Date.now()): boolean {
  return daysSince(state.lastBackupAt, now) > BACKUP_STALE_DAYS;
}

export function relTime(ts: number | null, now: number = Date.now()): string {
  if (ts === null) return 'never';
  const diff = now - ts;
  const d = Math.floor(diff / DAY_MS);
  if (d >= 1) return `${d} day${d === 1 ? '' : 's'} ago`;
  const h = Math.floor(diff / (1000 * 60 * 60));
  if (h >= 1) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const m = Math.max(1, Math.floor(diff / (1000 * 60)));
  return `${m} min${m === 1 ? '' : 's'} ago`;
}

export function suggestStrings(
  state: AppState,
  field: 'stock' | 'lens' | 'filter' | 'camera-name' | 'aperture' | 'shutter',
): string[] {
  const dedupe = (arr: string[]): string[] => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of arr) {
      const key = v.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(v.trim());
    }
    return out;
  };
  switch (field) {
    case 'stock':
      return dedupe(state.stocks.map((s) => s.name));
    case 'lens':
      return dedupe(state.lenses.map((l) => l.name));
    case 'filter':
      return dedupe(state.filters.map((f) => f.name));
    case 'camera-name':
      return dedupe(state.cameras.map((c) => c.name));
    case 'aperture': {
      const prior = state.shots.map((s) => s.aperture).filter((v): v is string => !!v);
      return dedupe(prior);
    }
    case 'shutter': {
      const prior = state.shots.map((s) => s.shutter).filter((v): v is string => !!v);
      return dedupe(prior);
    }
  }
}
