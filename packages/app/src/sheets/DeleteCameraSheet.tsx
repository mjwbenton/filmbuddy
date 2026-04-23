import { useAppState, completedRollsForCamera, currentRoll } from '../state';
import { useToast, Sheet } from '../ui';
import { useNav } from '../nav/context';

type Props = { cameraId: string };

export function DeleteCameraSheet({ cameraId }: Props) {
  const { state, mutators } = useAppState();
  const { closeSheet, openScreen } = useNav();
  const toast = useToast();
  const camera = state.cameras.find((c) => c.id === cameraId);

  if (!camera) return null;

  const active = currentRoll(state, cameraId);
  const past = completedRollsForCamera(state, cameraId);
  const rollCount = past.length + (active ? 1 : 0);

  const submit = () => {
    mutators.deleteCamera(cameraId);
    toast(`Deleted ${camera.name}`);
    closeSheet();
    openScreen({ name: 'home' });
  };

  return (
    <Sheet open title="Delete camera" onClose={closeSheet} actionLabel="Delete" onAction={submit}>
      <p style={{ fontSize: 15, color: 'var(--ink-2)' }}>
        Permanently delete <strong>{camera.name}</strong>?
      </p>
      {rollCount > 0 && (
        <p style={{ fontSize: 13, color: 'var(--danger)' }}>
          This will also delete {rollCount} roll{rollCount === 1 ? '' : 's'} and all logged shots
          for this camera.
        </p>
      )}
      <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>This cannot be undone.</p>
    </Sheet>
  );
}
