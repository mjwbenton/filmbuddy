import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  BACKUP_KEY_PATTERN,
  emptyState,
  generateBackupKey,
  isBackupStale,
  daysSince,
  STATE_KEY,
  loadState,
  saveState,
  suggestStrings,
  effectiveLensAt,
  effectiveFilterAt,
  currentLensId,
  currentFilterId,
} from './index';
import {
  addCamera,
  completeRoll,
  ensureLens,
  ensureStock,
  loadRoll,
  logShot,
  markBackedUp,
  restoreFromSnapshot,
  setLensFilter,
  setShotCount,
  updateShot,
} from './mutators';
import type { AppState } from './types';

function fresh(): AppState {
  return emptyState();
}

describe('backup key', () => {
  it('matches expected pattern fb-xxxx-xxxx-xxxx', () => {
    for (let i = 0; i < 10; i++) {
      const k = generateBackupKey();
      expect(k).toMatch(BACKUP_KEY_PATTERN);
    }
  });
});

describe('persistence round-trip', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and reloads state', () => {
    const s = fresh();
    const afterAdd = addCamera(s, { name: 'M6' });
    saveState(afterAdd);
    const reloaded = loadState();
    expect(reloaded.cameras).toHaveLength(1);
    expect(reloaded.cameras[0]?.name).toBe('M6');
    expect(reloaded.backupKey).toBe(afterAdd.backupKey);
  });

  it('generates backupKey on first visit', () => {
    const loaded = loadState();
    expect(loaded.backupKey).toMatch(BACKUP_KEY_PATTERN);
    const raw = localStorage.getItem(STATE_KEY);
    expect(raw).not.toBeNull();
  });

  it('recovers from malformed JSON', () => {
    localStorage.setItem(STATE_KEY, '{{not json');
    const loaded = loadState();
    expect(loaded.cameras).toEqual([]);
    expect(loaded.backupKey).toMatch(BACKUP_KEY_PATTERN);
  });
});

describe('stale backup detection', () => {
  const DAY = 1000 * 60 * 60 * 24;
  const now = Date.now();

  it('returns Infinity when never backed up', () => {
    expect(daysSince(null)).toBe(Infinity);
    expect(isBackupStale(fresh())).toBe(true);
  });

  it('14 days ago is not stale', () => {
    const s: AppState = { ...fresh(), lastBackupAt: now - 14 * DAY };
    expect(isBackupStale(s, now)).toBe(false);
  });

  it('15 days ago is not stale (boundary)', () => {
    const s: AppState = { ...fresh(), lastBackupAt: now - 15 * DAY };
    expect(isBackupStale(s, now)).toBe(false);
  });

  it('16 days ago is stale', () => {
    const s: AppState = { ...fresh(), lastBackupAt: now - 16 * DAY };
    expect(isBackupStale(s, now)).toBe(true);
  });

  it('markBackedUp clears staleness', () => {
    const s = markBackedUp(fresh(), now);
    expect(isBackupStale(s, now)).toBe(false);
  });
});

describe('implicit creators de-dupe by case-insensitive name', () => {
  it('ensureStock reuses existing match', () => {
    const s0 = fresh();
    const [s1, a] = ensureStock(s0, 'Portra 400', 400);
    const [s2, b] = ensureStock(s1, 'portra 400', 400);
    expect(a.id).toBe(b.id);
    expect(s2.stocks).toHaveLength(1);
  });

  it('ensureLens reuses existing match', () => {
    const [s1, a] = ensureLens(fresh(), 'Voigtländer 35mm f/1.2');
    const [s2, b] = ensureLens(s1, 'VOIGTLÄNDER 35MM F/1.2');
    expect(a.id).toBe(b.id);
    expect(s2.lenses).toHaveLength(1);
  });
});

describe('roll lifecycle', () => {
  it('loadRoll creates stock + roll and points camera at it', () => {
    const s0 = addCamera(fresh(), { name: 'M6' });
    const camId = s0.cameras[0]!.id;
    const s1 = loadRoll(s0, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    expect(s1.stocks).toHaveLength(1);
    expect(s1.rolls).toHaveLength(1);
    const cam = s1.cameras.find((c) => c.id === camId)!;
    expect(cam.currentRollId).toBe(s1.rolls[0]?.id);
  });

  it('loadRoll auto-completes the previous roll when one is already active', () => {
    const s0 = addCamera(fresh(), { name: 'M6' });
    const camId = s0.cameras[0]!.id;
    const s1 = loadRoll(s0, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    const firstRollId = s1.rolls[0]!.id;
    const s2 = loadRoll(s1, { cameraId: camId, stockName: 'Portra 400', iso: 400, length: 36 });
    expect(s2.rolls).toHaveLength(2);
    const prev = s2.rolls.find((r) => r.id === firstRollId)!;
    expect(prev.completedAt).toBeTypeOf('number');
    const cam = s2.cameras.find((c) => c.id === camId)!;
    expect(cam.currentRollId).not.toBe(firstRollId);
    expect(cam.currentRollId).toBe(s2.rolls.find((r) => r.id !== firstRollId)!.id);
  });

  it('completeRoll clears camera.currentRollId and sets completedAt', () => {
    const s0 = addCamera(fresh(), { name: 'M6' });
    const camId = s0.cameras[0]!.id;
    const s1 = loadRoll(s0, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    const rollId = s1.rolls[0]!.id;
    const s2 = completeRoll(s1, rollId);
    expect(s2.cameras.find((c) => c.id === camId)?.currentRollId).toBeNull();
    expect(s2.rolls[0]?.completedAt).toBeTypeOf('number');
  });

  it('logShot merges into an existing shot at the same frame', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    s = loadRoll(s, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    s = setLensFilter(s, { cameraId: camId, lensName: '35 Summilux', filterName: 'Y2 yellow' });
    s = logShot(s, { cameraId: camId, frame: 1, aperture: 'f/5.6', shutter: '1/250' });
    expect(s.shots).toHaveLength(1);
    const shot = s.shots[0]!;
    expect(shot.aperture).toBe('f/5.6');
    expect(shot.shutter).toBe('1/250');
    expect(shot.lensId).toBe(s.lenses[0]!.id);
    expect(shot.filterId).toBe(s.filters[0]!.id);
    expect(s.rolls[0]?.shotCount).toBe(1);
  });

  it('setShotCount clamps to non-negative integers', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    s = loadRoll(s, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    s = setShotCount(s, camId, -5);
    expect(s.rolls[0]?.shotCount).toBe(0);
    s = setShotCount(s, camId, 12.7);
    expect(s.rolls[0]?.shotCount).toBe(12);
  });

  it('updateShot merges patch fields', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    s = loadRoll(s, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    s = logShot(s, { cameraId: camId, frame: 1, aperture: 'f/5.6' });
    const shotId = s.shots[0]!.id;
    s = updateShot(s, shotId, { note: 'golden hour' });
    expect(s.shots[0]?.aperture).toBe('f/5.6');
    expect(s.shots[0]?.note).toBe('golden hour');
  });
});

describe('digital camera auto-roll', () => {
  it('creates a 9999-length digital roll on add when flag is set', () => {
    const s = addCamera(fresh(), {
      name: 'M11',
      startDigitalRoll: true,
    });
    expect(s.rolls).toHaveLength(1);
    expect(s.rolls[0]?.length).toBe(9999);
    expect(s.rolls[0]?.digital).toBe(true);
  });

  it('does not create a roll when flag is not set', () => {
    const s = addCamera(fresh(), { name: 'M6' });
    expect(s.rolls).toHaveLength(0);
  });
});

describe('restoreFromSnapshot preserves local backup key', () => {
  it('keeps local key, takes everything else from snapshot', () => {
    const local = fresh();
    const snapshot: AppState = {
      ...fresh(),
      backupKey: 'fb-aaaa-aaaa-aaaa',
      cameras: [{ id: 'x', name: 'M6' }],
    };
    const restored = restoreFromSnapshot(local, snapshot);
    expect(restored.backupKey).toBe(local.backupKey);
    expect(restored.cameras).toHaveLength(1);
  });
});

describe('suggestStrings', () => {
  it('dedupes by case-insensitive name', () => {
    let s = fresh();
    [s] = ensureStock(s, 'Portra 400', 400);
    [s] = ensureStock(s, 'TRI-X 400', 400);
    [s] = ensureStock(s, 'portra 400', 400);
    expect(suggestStrings(s, 'stock')).toEqual(['Portra 400', 'TRI-X 400']);
  });

  it('returns non-null prior apertures/shutters', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    s = loadRoll(s, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    s = logShot(s, { cameraId: camId, frame: 1, aperture: 'f/2', shutter: '1/125' });
    s = logShot(s, { cameraId: camId, frame: 2, aperture: 'f/2', shutter: '1/60' });
    expect(suggestStrings(s, 'aperture')).toEqual(['f/2']);
    expect(suggestStrings(s, 'shutter')).toEqual(['1/125', '1/60']);
  });
});

describe('lens + filter as timeline events', () => {
  it('setLensFilter creates a shot at the pending frame and advances shotCount to that frame', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    s = loadRoll(s, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    s = setLensFilter(s, { cameraId: camId, lensName: '50 Summicron', filterName: null });
    expect(s.shots).toHaveLength(1);
    const shot = s.shots[0]!;
    expect(shot.frame).toBe(1);
    expect(shot.lensId).toBe(s.lenses[0]!.id);
    expect(shot.aperture ?? null).toBe(null);
    expect(s.rolls[0]?.shotCount).toBe(1);
  });

  it('setLensFilter honors an explicit frame and advances shotCount to max', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    s = loadRoll(s, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    s = setLensFilter(s, { cameraId: camId, lensName: 'Lens A', filterName: null, frame: 5 });
    expect(s.shots[0]?.frame).toBe(5);
    expect(s.rolls[0]?.shotCount).toBe(5);
  });

  it('effective lens/filter at a later frame carries forward from the last swap', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    s = loadRoll(s, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    s = setLensFilter(s, { cameraId: camId, lensName: '35 Summilux', filterName: 'Y2 yellow' });
    s = logShot(s, { cameraId: camId, frame: 1, aperture: 'f/5.6' });
    s = logShot(s, { cameraId: camId, frame: 2, aperture: 'f/8' });
    const rollId = s.rolls[0]!.id;
    const lensId = s.lenses[0]!.id;
    const filterId = s.filters[0]!.id;
    expect(effectiveLensAt(s, rollId, 2)).toBe(lensId);
    expect(effectiveFilterAt(s, rollId, 2)).toBe(filterId);
    // Frame 2 has no explicit lens/filter on its own shot record
    const frame2 = s.shots.find((x) => x.frame === 2)!;
    expect(frame2.lensId ?? null).toBe(null);
    expect(frame2.filterId ?? null).toBe(null);
  });

  it('setLensFilter at an existing frame updates that frame in place', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    s = loadRoll(s, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    s = setLensFilter(s, { cameraId: camId, lensName: 'Lens A', filterName: null, frame: 1 });
    s = setLensFilter(s, { cameraId: camId, lensName: 'Lens B', filterName: null, frame: 1 });
    const frame1Shots = s.shots.filter((x) => x.frame === 1);
    expect(frame1Shots).toHaveLength(1);
    const lensB = s.lenses.find((l) => l.name === 'Lens B')!;
    expect(frame1Shots[0]!.lensId).toBe(lensB.id);
  });

  it('currentLensId / currentFilterId reflect the most recent swap on the active roll', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    expect(currentLensId(s, camId)).toBeNull();
    s = loadRoll(s, { cameraId: camId, stockName: 'Tri-X', iso: 400, length: 36 });
    expect(currentLensId(s, camId)).toBeNull();
    s = setLensFilter(s, { cameraId: camId, lensName: '35 Summilux', filterName: 'Y2' });
    expect(currentLensId(s, camId)).toBe(s.lenses[0]!.id);
    expect(currentFilterId(s, camId)).toBe(s.filters[0]!.id);
  });

  it('setLensFilter is a no-op when no roll is loaded', () => {
    let s = addCamera(fresh(), { name: 'M6' });
    const camId = s.cameras[0]!.id;
    s = setLensFilter(s, { cameraId: camId, lensName: 'X', filterName: null });
    expect(s.shots).toHaveLength(0);
    expect(s.lenses).toHaveLength(0);
  });
});

describe('crypto availability in test env', () => {
  it('has getRandomValues', () => {
    // Sanity — jsdom should provide crypto
    expect(typeof crypto.getRandomValues).toBe('function');
    const k = generateBackupKey();
    expect(k).toMatch(BACKUP_KEY_PATTERN);
  });
});

// Silence unused-import lint rules for ts-only helpers
void vi;
