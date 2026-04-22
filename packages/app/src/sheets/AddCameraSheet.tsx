import { useState } from 'react';
import { useAppState, suggestStrings } from '../state';
import { useToast, Sheet, Field, SuggestInput, Seg, Chip } from '../ui';
import { useNav } from '../nav/context';
import { CAMERA_TYPES, ROLL_LENGTHS } from './constants';

export function AddCameraSheet() {
  const { state, mutators } = useAppState();
  const { closeSheet } = useNav();
  const toast = useToast();

  const [name, setName] = useState('');
  const [type, setType] = useState('35mm Rangefinder');
  const [kind, setKind] = useState<'analogue' | 'digital'>('analogue');
  const [defaultLength, setDefaultLength] = useState<number>(36);

  const typeSuggestions = Array.from(
    new Set([...CAMERA_TYPES, ...suggestStrings(state, 'camera-type')]),
  );

  const valid = name.trim() && type.trim();

  const submit = () => {
    if (!valid) return;
    const resolvedType =
      kind === 'digital' && !/Digital/i.test(type) ? `Digital ${type}` : type.trim();
    mutators.addCamera({
      name: name.trim(),
      type: resolvedType,
      startDigitalRoll: kind === 'digital',
    });
    toast(`Added ${name.trim()}`);
    closeSheet();
    void defaultLength; // analogue length is captured in LoadFilmSheet on first film load
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
            onChange={(v) => {
              setKind(v);
              if (v === 'digital' && !/Digital/i.test(type)) setType('Digital Rangefinder');
              if (v === 'analogue' && /Digital/i.test(type)) setType('35mm Rangefinder');
            }}
            options={[
              { value: 'analogue', label: 'Analogue' },
              { value: 'digital', label: 'Digital' },
            ]}
          />
        )}
      </Field>
      <Field label="Type">
        {() => (
          <SuggestInput
            value={type}
            onChange={setType}
            suggestions={
              kind === 'digital'
                ? typeSuggestions.filter((t) => /Digital/i.test(t))
                : typeSuggestions.filter((t) => !/Digital/i.test(t))
            }
          />
        )}
      </Field>
      {kind === 'analogue' && (
        <Field label="Default roll length">
          {() => (
            <div className="suggest-chips">
              {ROLL_LENGTHS.map((n) => (
                <Chip key={n} selected={defaultLength === n} onClick={() => setDefaultLength(n)}>
                  {n}
                </Chip>
              ))}
            </div>
          )}
        </Field>
      )}
    </Sheet>
  );
}
