import { z } from 'zod';
import { BACKUP_KEY_PATTERN } from '../state';

const camera = z.object({
  id: z.string(),
  name: z.string(),
  currentRollId: z.string().nullable().optional(),
  lensId: z.string().nullable().optional(),
  filterId: z.string().nullable().optional(),
});

const roll = z.object({
  id: z.string(),
  cameraId: z.string(),
  stockId: z.string(),
  iso: z.number(),
  length: z.number(),
  startedAt: z.number(),
  completedAt: z.number().nullable().optional(),
  shotCount: z.number(),
  digital: z.boolean().optional(),
});

const shot = z.object({
  id: z.string(),
  rollId: z.string(),
  frame: z.number(),
  aperture: z.string().nullable().optional(),
  shutter: z.string().nullable().optional(),
  lensId: z.string().nullable().optional(),
  filterId: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  ts: z.number(),
});

const stock = z.object({
  id: z.string(),
  name: z.string(),
  boxSpeed: z.number(),
});

const named = z.object({ id: z.string(), name: z.string() });

export const appStateSchema = z.object({
  cameras: z.array(camera),
  rolls: z.array(roll),
  shots: z.array(shot),
  stocks: z.array(stock),
  lenses: z.array(named),
  filters: z.array(named),
  backupKey: z.string().regex(BACKUP_KEY_PATTERN),
  lastBackupAt: z.number().nullable(),
});

export type AppStateSnapshot = z.infer<typeof appStateSchema>;
