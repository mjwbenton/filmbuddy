import { useState } from 'react';
import { useAppState } from '../state';
import { useToast, Sheet, Field, Seg } from '../ui';
import { useNav } from '../nav/context';

export function AddCameraSheet() {
  const { mutators } = useAppState();
  const { closeSheet } = useNav();
  const toast = useToast();

  const [name, setName] = useState('');
  const [kind, setKind] = useState<'analogue' | 'digital'>('analogue');

  const valid = name.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    mutators.addCamera({
      name: name.trim(),
      startDigitalRoll: kind === 'digital',
    });
    toast(`Added ${name.trim()}`);
    closeSheet();
  };

  return (
    <Sheet
      open
      title="Add camera"
      onClose={closeSheet}
      actionLabel="Add"
      actionDisabled={!valid}
      onAction={submit}
    >
      <Field label="Name">
        {({ inputId }) => (
          <input
            id={inputId}
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Leica M6, Mamiya 7, …"
            autoFocus
          />
        )}
      </Field>
      <Field label="Kind">
        {() => (
          <Seg
            value={kind}
            onChange={setKind}
            options={[
              { value: 'analogue', label: 'Analogue' },
              { value: 'digital', label: 'Digital' },
            ]}
          />
        )}
      </Field>
    </Sheet>
  );
}
