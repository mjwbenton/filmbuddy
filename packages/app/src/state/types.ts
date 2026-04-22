export type Camera = {
  id: string;
  name: string;
  currentRollId?: string | null;
};

export type Roll = {
  id: string;
  cameraId: string;
  stockId: string;
  iso: number;
  length: number;
  startedAt: number;
  completedAt?: number | null;
  shotCount: number;
  digital?: boolean;
};

export type Shot = {
  id: string;
  rollId: string;
  frame: number;
  aperture?: string | null;
  shutter?: string | null;
  lensId?: string | null;
  filterId?: string | null;
  note?: string | null;
  ts: number;
};

export type Stock = {
  id: string;
  name: string;
  boxSpeed: number;
};

export type Lens = { id: string; name: string };
export type Filter = { id: string; name: string };

export type AppState = {
  cameras: Camera[];
  rolls: Roll[];
  shots: Shot[];
  stocks: Stock[];
  lenses: Lens[];
  filters: Filter[];
  backupKey: string;
  lastBackupAt: number | null;
};
