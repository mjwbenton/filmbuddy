import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { AppState } from './types';
import { loadState, saveState } from './persistence';
import * as M from './mutators';

type Mutators = {
  addCamera: (args: Parameters<typeof M.addCamera>[1]) => void;
  deleteCamera: (cameraId: string) => void;
  loadRoll: (args: Parameters<typeof M.loadRoll>[1]) => void;
  completeRoll: (rollId: string) => void;
  deleteRoll: (rollId: string) => void;
  setLensFilter: (args: Parameters<typeof M.setLensFilter>[1]) => void;
  setShotCount: (cameraId: string, n: number) => void;
  logShot: (args: Parameters<typeof M.logShot>[1]) => void;
  updateShot: (shotId: string, patch: Parameters<typeof M.updateShot>[2]) => void;
  markBackedUp: (at?: number) => void;
  restoreFromSnapshot: (snapshot: AppState) => void;
};

type Ctx = { state: AppState; mutators: Mutators };

const StateContext = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    saveState(state);
  }, [state]);

  const apply = useCallback(<A extends unknown[]>(fn: (s: AppState, ...args: A) => AppState) => {
    return (...args: A) => {
      setState((prev) => fn(prev, ...args));
    };
  }, []);

  const mutators = useMemo<Mutators>(
    () => ({
      addCamera: apply(M.addCamera),
      deleteCamera: (cameraId) => setState((prev) => M.deleteCamera(prev, cameraId)),
      loadRoll: apply(M.loadRoll),
      completeRoll: apply(M.completeRoll),
      deleteRoll: (rollId) => setState((prev) => M.deleteRoll(prev, rollId)),
      setLensFilter: apply(M.setLensFilter),
      setShotCount: (cameraId, n) => setState((prev) => M.setShotCount(prev, cameraId, n)),
      logShot: apply(M.logShot),
      updateShot: (shotId, patch) => setState((prev) => M.updateShot(prev, shotId, patch)),
      markBackedUp: (at) => setState((prev) => M.markBackedUp(prev, at)),
      restoreFromSnapshot: apply(M.restoreFromSnapshot),
    }),
    [apply],
  );

  const value = useMemo(() => ({ state, mutators }), [state, mutators]);
  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState(): Ctx {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}
