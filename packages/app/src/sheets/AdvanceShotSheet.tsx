import { useAppState, currentRoll } from '../state';
import { useToast, Sheet } from '../ui';
import { useNav } from '../nav/context';

type Props = { cameraId: string };

export function AdvanceShotSheet({ cameraId }: Props) {
  const { state, mutators } = useAppState();
  const { closeSheet } = useNav();
  const toast = useToast();
  const roll = currentRoll(state, cameraId);

  if (!roll) return null;

  const nextFrame = roll.shotCount + 1;

  const submit = () => {
    mutators.advanceShot(cameraId);
    toast(`Advanced to frame #${nextFrame}`);
    closeSheet();
  };

  return (
    <Sheet open title="Advance shot" onClose={closeSheet} actionLabel="Advance" onAction={submit}>
      <p style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 0 }}>
        Next frame will be <strong className="mono">#{nextFrame}</strong>. Use <em>Log shot</em>{' '}
        instead if you want to record aperture/shutter for this frame.
      </p>
    </Sheet>
  );
}
