import type { AppState, Camera, Filter, Lens, Roll, Shot, Stock } from './types';
import { uid } from './id';
import { defaultRollLength, isDigitalType } from './selectors';

function ensureByName<T extends { id: string; name: string }>(
  arr: T[],
  name: string,
  make: (name: string) => T,
): { list: T[]; item: T } {
  const trimmed = name.trim();
  const existing = arr.find((x) => x.name.trim().toLowerCase() === trimmed.toLowerCase());
  if (existing) return { list: arr, item: existing };
  const item = make(trimmed);
  return { list: [...arr, item], item };
}

export function ensureStock(state: AppState, name: string, iso: number): [AppState, Stock] {
  const { list, item } = ensureByName(state.stocks, name, (n) => ({
    id: uid('stock'),
    name: n,
    boxSpeed: iso,
  }));
  return [{ ...state, stocks: list }, item];
}

export function ensureLens(state: AppState, name: string): [AppState, Lens] {
  const { list, item } = ensureByName(state.lenses, name, (n) => ({ id: uid('lens'), name: n }));
  return [{ ...state, lenses: list }, item];
}

export function ensureFilter(state: AppState, name: string): [AppState, Filter] {
  const { list, item } = ensureByName(state.filters, name, (n) => ({
    id: uid('filter'),
    name: n,
  }));
  return [{ ...state, filters: list }, item];
}

export function addCamera(
  state: AppState,
  args: { name: string; type: string; startDigitalRoll?: boolean },
): AppState {
  const camera: Camera = {
    id: uid('cam'),
    name: args.name.trim(),
    type: args.type.trim(),
    currentRollId: null,
    lensId: null,
    filterId: null,
  };
  let next: AppState = { ...state, cameras: [...state.cameras, camera] };
  if (args.startDigitalRoll && isDigitalType(camera.type)) {
    const roll: Roll = {
      id: uid('roll'),
      cameraId: camera.id,
      stockId: '',
      iso: 0,
      length: defaultRollLength(camera.type),
      startedAt: Date.now(),
      completedAt: null,
      shotCount: 0,
      digital: true,
    };
    next = {
      ...next,
      rolls: [...next.rolls, roll],
      cameras: next.cameras.map((c) => (c.id === camera.id ? { ...c, currentRollId: roll.id } : c)),
    };
  }
  return next;
}

export function loadRoll(
  state: AppState,
  args: { cameraId: string; stockName: string; iso: number; length: number },
): AppState {
  const [s1, stock] = ensureStock(state, args.stockName, args.iso);
  const roll: Roll = {
    id: uid('roll'),
    cameraId: args.cameraId,
    stockId: stock.id,
    iso: args.iso,
    length: args.length,
    startedAt: Date.now(),
    completedAt: null,
    shotCount: 0,
  };
  return {
    ...s1,
    rolls: [...s1.rolls, roll],
    cameras: s1.cameras.map((c) => (c.id === args.cameraId ? { ...c, currentRollId: roll.id } : c)),
  };
}

export function completeRoll(state: AppState, rollId: string): AppState {
  const now = Date.now();
  return {
    ...state,
    rolls: state.rolls.map((r) => (r.id === rollId ? { ...r, completedAt: now } : r)),
    cameras: state.cameras.map((c) =>
      c.currentRollId === rollId ? { ...c, currentRollId: null } : c,
    ),
  };
}

export function setLensFilter(
  state: AppState,
  args: { cameraId: string; lensName: string | null; filterName: string | null },
): AppState {
  let next = state;
  let lensId: string | null = null;
  let filterId: string | null = null;
  if (args.lensName && args.lensName.trim()) {
    const [s, lens] = ensureLens(next, args.lensName);
    next = s;
    lensId = lens.id;
  }
  if (args.filterName && args.filterName.trim()) {
    const [s, filter] = ensureFilter(next, args.filterName);
    next = s;
    filterId = filter.id;
  }
  return {
    ...next,
    cameras: next.cameras.map((c) => (c.id === args.cameraId ? { ...c, lensId, filterId } : c)),
  };
}

export function setShotCount(state: AppState, cameraId: string, n: number): AppState {
  const cam = state.cameras.find((c) => c.id === cameraId);
  if (!cam?.currentRollId) return state;
  const count = Math.max(0, Math.floor(n));
  return {
    ...state,
    rolls: state.rolls.map((r) => (r.id === cam.currentRollId ? { ...r, shotCount: count } : r)),
  };
}

export function logShot(
  state: AppState,
  args: {
    cameraId: string;
    frame: number;
    aperture?: string | null;
    shutter?: string | null;
    note?: string | null;
  },
): AppState {
  const cam = state.cameras.find((c) => c.id === args.cameraId);
  if (!cam?.currentRollId) return state;
  const shot: Shot = {
    id: uid('shot'),
    rollId: cam.currentRollId,
    frame: args.frame,
    aperture: args.aperture?.trim() || null,
    shutter: args.shutter?.trim() || null,
    lensId: cam.lensId ?? null,
    filterId: cam.filterId ?? null,
    note: args.note?.trim() || null,
    ts: Date.now(),
  };
  const withShot: AppState = { ...state, shots: [...state.shots, shot] };
  return {
    ...withShot,
    rolls: withShot.rolls.map((r) =>
      r.id === cam.currentRollId ? { ...r, shotCount: Math.max(r.shotCount, args.frame) } : r,
    ),
  };
}

export function updateShot(
  state: AppState,
  shotId: string,
  patch: { aperture?: string | null; shutter?: string | null; note?: string | null },
): AppState {
  return {
    ...state,
    shots: state.shots.map((s) =>
      s.id === shotId
        ? {
            ...s,
            aperture:
              patch.aperture !== undefined ? patch.aperture?.trim() || null : (s.aperture ?? null),
            shutter:
              patch.shutter !== undefined ? patch.shutter?.trim() || null : (s.shutter ?? null),
            note: patch.note !== undefined ? patch.note?.trim() || null : (s.note ?? null),
          }
        : s,
    ),
  };
}

export function markBackedUp(state: AppState, at: number = Date.now()): AppState {
  return { ...state, lastBackupAt: at };
}

export function restoreFromSnapshot(state: AppState, snapshot: AppState): AppState {
  return { ...snapshot, backupKey: state.backupKey };
}
