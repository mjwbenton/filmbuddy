import { useAppState, shotsForRoll } from '../state';
import { useToast, Sheet } from '../ui';
import { useNav } from '../nav/context';

type Props = { cameraId: string; rollId: string };

export function DeleteRollSheet({ cameraId, rollId }: Props) {
  const { state, mutators } = useAppState();
  const { closeSheet, openScreen } = useNav();
  const toast = useToast();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const roll = state.rolls.find((r) => r.id === rollId);

  if (!camera || !roll) return null;

  const stock = state.stocks.find((s) => s.id === roll.stockId);
  const shotCount = shotsForRoll(state, rollId).length;
  const isActive = camera.currentRollId === rollId;

  const submit = () => {
    mutators.deleteRoll(rollId);
    toast('Roll deleted');
    closeSheet();
    openScreen({ name: 'camera', cameraId });
  };

  return (
    <Sheet open title="Delete roll" onClose={closeSheet} actionLabel="Delete" onAction={submit}>
      <p style={{ fontSize: 15, color: 'var(--ink-2)' }}>
        Permanently delete <strong>{stock?.name ?? 'this roll'}</strong>
        {isActive ? ' (the current roll)' : ''} on <strong>{camera.name}</strong>?
      </p>
      {shotCount > 0 && (
        <p style={{ fontSize: 13, color: 'var(--danger)' }}>
          {shotCount} logged shot{shotCount === 1 ? '' : 's'} will also be deleted.
        </p>
      )}
      <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>This cannot be undone.</p>
    </Sheet>
  );
}
