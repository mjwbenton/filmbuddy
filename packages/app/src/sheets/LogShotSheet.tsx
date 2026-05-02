import { useState } from 'react';
import { useAppState, currentRoll, suggestStrings } from '../state';
import { useToast, Sheet, Field, SuggestInput, Input, Textarea } from '../ui';
import { useNav } from '../nav/context';
import { APERTURES, SHUTTERS } from './constants';

type Props = { cameraId: string; editShotId?: string; frame?: number };

export function LogShotSheet({ cameraId, editShotId, frame: initialFrame }: Props) {
  const { state, mutators } = useAppState();
  const { closeSheet } = useNav();
  const toast = useToast();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const roll = camera ? currentRoll(state, cameraId) : null;
  const editShot = editShotId ? state.shots.find((s) => s.id === editShotId) : null;

  const [frame, setFrame] = useState(
    String(editShot?.frame ?? initialFrame ?? (roll?.shotCount ?? 0) + 1),
  );
  const [aperture, setAperture] = useState(editShot?.aperture ?? '');
  const [shutter, setShutter] = useState(editShot?.shutter ?? '');
  const [note, setNote] = useState(editShot?.note ?? '');

  if (!camera || !roll) return null;

  const apertureSuggest = Array.from(new Set([...APERTURES, ...suggestStrings(state, 'aperture')]));
  const shutterSuggest = Array.from(new Set([...SHUTTERS, ...suggestStrings(state, 'shutter')]));

  const valid = Number(frame) > 0;

  const submit = () => {
    if (!valid) return;
    if (editShot) {
      mutators.updateShot(editShot.id, {
        aperture: aperture.trim() || null,
        shutter: shutter.trim() || null,
        note: note.trim() || null,
      });
      toast('Shot updated');
    } else {
      mutators.logShot({
        cameraId,
        frame: Number(frame),
        aperture: aperture.trim() || null,
        shutter: shutter.trim() || null,
        note: note.trim() || null,
      });
      toast(`Frame #${frame} logged`);
    }
    closeSheet();
  };

  return (
    <Sheet
      open
      title={editShot ? 'Edit shot' : 'Log shot'}
      onClose={closeSheet}
      actionLabel={editShot ? 'Save' : 'Log'}
      actionDisabled={!valid}
      onAction={submit}
    >
      <Field label="Frame">
        {({ inputId }) => (
          <Input
            id={inputId}
            type="number"
            min={1}
            value={frame}
            onChange={(e) => setFrame(e.target.value)}
            disabled={!!editShot}
          />
        )}
      </Field>
      <div className="as-grid">
        <Field label="Aperture">
          {() => (
            <SuggestInput
              value={aperture}
              onChange={setAperture}
              suggestions={apertureSuggest}
              placeholder="f/5.6"
            />
          )}
        </Field>
        <Field label="Shutter">
          {() => (
            <SuggestInput
              value={shutter}
              onChange={setShutter}
              suggestions={shutterSuggest}
              placeholder="1/250"
            />
          )}
        </Field>
      </div>
      <Field label="Note">
        {({ inputId }) => (
          <Textarea id={inputId} value={note} onChange={(e) => setNote(e.target.value)} />
        )}
      </Field>
    </Sheet>
  );
}
