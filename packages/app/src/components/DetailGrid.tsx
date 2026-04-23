import type { AppState, Roll, Shot } from '../state';
import { effectiveLensAt, effectiveFilterAt } from '../state';

type Props = {
  state: AppState;
  roll: Roll;
  shot: Shot | null;
  frame: number;
};

export function DetailGrid({ state, roll, shot, frame }: Props) {
  const lensId = effectiveLensAt(state, roll.id, frame);
  const filterId = effectiveFilterAt(state, roll.id, frame);
  const lens = lensId ? state.lenses.find((l) => l.id === lensId) : null;
  const filter = filterId ? state.filters.find((f) => f.id === filterId) : null;

  const rows: Array<[string, string]> = [
    ['Aperture', shot?.aperture ?? '—'],
    ['Shutter', shot?.shutter ?? '—'],
    ['Lens', lens?.name ?? '—'],
    ['Filter', filter?.name ?? '—'],
  ];

  return (
    <>
      <dl className="detail-grid">
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: 'contents' }}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {shot?.note && <div className="shot-note">{shot.note}</div>}
    </>
  );
}
