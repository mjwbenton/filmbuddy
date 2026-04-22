import { useAppState, currentRoll, isDigitalType } from '../state';
import { useToast, Sheet } from '../ui';
import { useNav } from '../nav/context';

type Props = { cameraId: string };

export function CompleteRollSheet({ cameraId }: Props) {
  const { state, mutators } = useAppState();
  const { closeSheet } = useNav();
  const toast = useToast();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const roll = camera ? currentRoll(state, cameraId) : null;

  if (!camera || !roll) return null;

  const stock = state.stocks.find((s) => s.id === roll.stockId);
  const digital = isDigitalType(camera.type);

  const submit = () => {
    mutators.completeRoll(roll.id);
    toast('Roll marked complete');
    closeSheet();
  };

  return (
    <Sheet open title="Complete roll" onClose={closeSheet} actionLabel="Complete" onAction={submit}>
      <p style={{ fontSize: 15, color: 'var(--ink-2)' }}>
        Finish <strong>{stock?.name ?? 'this roll'}</strong> on <strong>{camera.name}</strong>?
      </p>
      <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>
        {roll.shotCount} shot{roll.shotCount === 1 ? '' : 's'} logged
        {digital ? '' : ` of ${roll.length}`}.
      </p>
    </Sheet>
  );
}
