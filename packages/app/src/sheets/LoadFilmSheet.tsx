import { useState } from 'react';
import { useAppState, suggestStrings, defaultRollLength } from '../state';
import { useToast, Sheet, Field, SuggestInput, Input } from '../ui';
import { useNav } from '../nav/context';
import { COMMON_ISOS } from './constants';

type Props = { cameraId: string };

export function LoadFilmSheet({ cameraId }: Props) {
  const { state, mutators } = useAppState();
  const { closeSheet } = useNav();
  const toast = useToast();
  const camera = state.cameras.find((c) => c.id === cameraId);

  const [stock, setStock] = useState('');
  const [iso, setIso] = useState('400');
  const [length, setLength] = useState(camera ? String(defaultRollLength(camera.type)) : '36');

  if (!camera) return null;

  const valid = stock.trim() && Number(iso) > 0 && Number(length) > 0;
  const priorStocks = suggestStrings(state, 'stock');
  const priorIsos = Array.from(
    new Set([...COMMON_ISOS, ...state.stocks.map((s) => String(s.boxSpeed))]),
  );

  const submit = () => {
    if (!valid) return;
    mutators.loadRoll({
      cameraId,
      stockName: stock.trim(),
      iso: Number(iso),
      length: Number(length),
    });
    toast(`Loaded ${stock.trim()} @ ISO ${iso}`);
    closeSheet();
  };

  return (
    <Sheet
      open
      title="Load film"
      onClose={closeSheet}
      actionLabel="Load"
      actionDisabled={!valid}
      onAction={submit}
    >
      <Field label="Stock">
        {() => (
          <SuggestInput
            value={stock}
            onChange={setStock}
            suggestions={priorStocks}
            placeholder="Portra 400, Tri-X, …"
          />
        )}
      </Field>
      <Field label="ISO">
        {() => (
          <SuggestInput value={iso} onChange={setIso} suggestions={priorIsos} inputMode="numeric" />
        )}
      </Field>
      <Field label="Roll length">
        {({ inputId }) => (
          <Input
            id={inputId}
            type="number"
            min={1}
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        )}
      </Field>
    </Sheet>
  );
}
