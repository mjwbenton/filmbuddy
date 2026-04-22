import type { AppState } from './types';
import { generateBackupKey } from './id';

export const STATE_KEY = 'filmbuddy.state.v2';

export function emptyState(): AppState {
  return {
    cameras: [],
    rolls: [],
    shots: [],
    stocks: [],
    lenses: [],
    filters: [],
    backupKey: generateBackupKey(),
    lastBackupAt: null,
    homeLayout: 'stacked',
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return {
        ...emptyState(),
        ...parsed,
      };
    }
  } catch {
    // fall through to empty state
  }
  const fresh = emptyState();
  saveState(fresh);
  return fresh;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — in-memory only for this session
  }
}
