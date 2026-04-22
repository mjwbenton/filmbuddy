import { describe, it, expect } from 'vitest';
import { appStateSchema } from './schema';
import { emptyState, generateBackupKey } from '../state';

describe('appStateSchema', () => {
  it('accepts a fresh empty state', () => {
    const s = emptyState();
    expect(() => appStateSchema.parse(s)).not.toThrow();
  });

  it('rejects a missing backupKey', () => {
    const { backupKey: _omit, ...rest } = emptyState();
    void _omit;
    expect(() => appStateSchema.parse(rest)).toThrow();
  });

  it('rejects an invalid backupKey format', () => {
    const s = { ...emptyState(), backupKey: 'not-a-valid-key' };
    expect(() => appStateSchema.parse(s)).toThrow();
  });

  it('round-trips through JSON', () => {
    const s = { ...emptyState(), backupKey: generateBackupKey() };
    const round = JSON.parse(JSON.stringify(s)) as unknown;
    expect(() => appStateSchema.parse(round)).not.toThrow();
  });
});
