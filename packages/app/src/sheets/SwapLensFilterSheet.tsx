import { useState } from 'react';
import { useAppState, suggestStrings, currentLensId, currentFilterId, currentRoll } from '../state';
import { useToast, Sheet, Field, Input, SuggestInput, Seg } from '../ui';
import { useNav } from '../nav/context';

type Props = { cameraId: string; frame?: number };

export function SwapLensFilterSheet({ cameraId, frame: initialFrame }: Props) {
  const { state, mutators } = useAppState();
  const { closeSheet } = useNav();
  const toast = useToast();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const roll = camera ? currentRoll(state, cameraId) : null;
  const lensId = currentLensId(state, cameraId);
  const filterId = currentFilterId(state, cameraId);
  const currentLensName = lensId ? (state.lenses.find((l) => l.id === lensId)?.name ?? '') : '';
  const currentFilterName = filterId
    ? (state.filters.find((f) => f.id === filterId)?.name ?? '')
    : '';

  const [frame, setFrame] = useState(String(initialFrame ?? (roll?.shotCount ?? 0) + 1));
  const [lens, setLens] = useState(currentLensName);
  const [withFilter, setWithFilter] = useState<'yes' | 'no'>(currentFilterName ? 'yes' : 'no');
  const [filter, setFilter] = useState(currentFilterName);

  if (!camera || !roll) return null;

  const priorLenses = suggestStrings(state, 'lens');
  const priorFilters = suggestStrings(state, 'filter');

  const valid = Number(frame) > 0;

  const submit = () => {
    if (!valid) return;
    mutators.setLensFilter({
      cameraId,
      lensName: lens.trim() || null,
      filterName: withFilter === 'yes' ? filter.trim() || null : null,
      frame: Number(frame),
    });
    toast('Lens swapped');
    closeSheet();
  };

  return (
    <Sheet open title="Swap lens" onClose={closeSheet} actionLabel="Save" onAction={submit}>
      <Field label="Frame">
        {({ inputId }) => (
          <Input
            id={inputId}
            type="number"
            min={1}
            value={frame}
            onChange={(e) => setFrame(e.target.value)}
          />
        )}
      </Field>
      <Field label="Lens">
        {() => (
          <SuggestInput
            value={lens}
            onChange={setLens}
            suggestions={priorLenses}
            placeholder="Voigtländer 35mm f/1.2, …"
          />
        )}
      </Field>
      <Field label="Filter">
        {() => (
          <>
            <Seg
              value={withFilter}
              onChange={setWithFilter}
              options={[
                { value: 'no', label: 'No filter' },
                { value: 'yes', label: 'With filter' },
              ]}
            />
            {withFilter === 'yes' && (
              <div style={{ marginTop: 8 }}>
                <SuggestInput
                  value={filter}
                  onChange={setFilter}
                  suggestions={priorFilters}
                  placeholder="Y2 yellow, ND 0.9, …"
                />
              </div>
            )}
          </>
        )}
      </Field>
    </Sheet>
  );
}
