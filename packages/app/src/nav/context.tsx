import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Screen =
  | { name: 'home' }
  | { name: 'camera'; cameraId: string }
  | { name: 'past-roll'; cameraId: string; rollId: string };

export type SheetState =
  | { kind: 'load-film'; cameraId: string }
  | { kind: 'swap-lens-filter'; cameraId: string }
  | { kind: 'log-shot'; cameraId: string; editShotId?: string }
  | { kind: 'change-shot'; cameraId: string }
  | { kind: 'complete-roll'; cameraId: string }
  | { kind: 'add-camera' }
  | { kind: 'more'; cameraId: string }
  | { kind: 'delete-camera'; cameraId: string }
  | { kind: 'delete-roll'; cameraId: string; rollId: string }
  | { kind: 'backup' }
  | { kind: 'restore' };

type Nav = {
  screen: Screen;
  sheet: SheetState | null;
  openScreen: (s: Screen) => void;
  openSheet: (s: SheetState) => void;
  closeSheet: () => void;
};

const NavContext = createContext<Nav | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [sheet, setSheet] = useState<SheetState | null>(null);

  const openScreen = useCallback((s: Screen) => setScreen(s), []);
  const openSheet = useCallback((s: SheetState) => setSheet(s), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const value = useMemo(
    () => ({ screen, sheet, openScreen, openSheet, closeSheet }),
    [screen, sheet, openScreen, openSheet, closeSheet],
  );
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): Nav {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used inside <NavProvider>');
  return ctx;
}
