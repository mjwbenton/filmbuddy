import { useNav } from '../nav/context';
import { LoadFilmSheet } from './LoadFilmSheet';
import { SwapLensFilterSheet } from './SwapLensFilterSheet';
import { LogShotSheet } from './LogShotSheet';
import { AdvanceShotSheet } from './AdvanceShotSheet';
import { ChangeShotSheet } from './ChangeShotSheet';
import { CompleteRollSheet } from './CompleteRollSheet';
import { AddCameraSheet } from './AddCameraSheet';
import { MoreActionsSheet } from './MoreActionsSheet';
import { BackupSheet } from './BackupSheet';
import { RestoreSheet } from './RestoreSheet';

export function SheetRoot() {
  const { sheet } = useNav();
  if (!sheet) return null;

  switch (sheet.kind) {
    case 'load-film':
      return <LoadFilmSheet cameraId={sheet.cameraId} />;
    case 'swap-lens-filter':
      return <SwapLensFilterSheet cameraId={sheet.cameraId} />;
    case 'log-shot':
      return (
        <LogShotSheet
          cameraId={sheet.cameraId}
          {...(sheet.editShotId ? { editShotId: sheet.editShotId } : {})}
        />
      );
    case 'advance-shot':
      return <AdvanceShotSheet cameraId={sheet.cameraId} />;
    case 'change-shot':
      return <ChangeShotSheet cameraId={sheet.cameraId} />;
    case 'complete-roll':
      return <CompleteRollSheet cameraId={sheet.cameraId} />;
    case 'add-camera':
      return <AddCameraSheet />;
    case 'more':
      return <MoreActionsSheet cameraId={sheet.cameraId} />;
    case 'backup':
      return <BackupSheet />;
    case 'restore':
      return <RestoreSheet />;
  }
}
