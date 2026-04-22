import { useState } from 'react';
import { useAppState, currentRoll } from '../state';
import { useToast, Sheet, Field, Input } from '../ui';
import { useNav } from '../nav/context';

type Props = { cameraId: string };

export function ChangeShotSheet({ cameraId }: Props) {
  const { state, mutators } = useAppState();
  const { closeSheet } = useNav();
  const toast = useToast();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const roll = camera ? currentRoll(state, cameraId) : null;
  const [value, setValue] = useState(String(roll?.shotCount ?? 0));

  if (!camera || !roll) return null;

  const title = roll.digital ? 'Set in-camera counter' : 'Change shot number';
  const n = Math.max(0, Math.floor(Number(value)));
  const valid = Number.isFinite(Number(value));

  const submit = () => {
    if (!valid) return;
    mutators.setShotCount(cameraId, n);
    toast(`Shot count set to ${n}`);
    closeSheet();
  };

  return (
    <Sheet
      open
      title={title}
      onClose={closeSheet}
      actionLabel="Save"
      actionDisabled={!valid}
      onAction={submit}
    >
      <Field label="Frame">
        {({ inputId }) => (
          <Input
            id={inputId}
            className="mono"
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ fontSize: 24, textAlign: 'center' }}
            autoFocus
          />
        )}
      </Field>
    </Sheet>
  );
}
