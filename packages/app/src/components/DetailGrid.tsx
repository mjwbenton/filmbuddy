import type { AppState, Roll, Shot } from '../state';
import { effectiveLensAt, effectiveFilterAt } from '../state';

type Props = {
  state: AppState;
  roll: Roll;
  shot: Shot | null;
  frame: number;
};

export function DetailGrid({ state, roll, shot, frame }: Props) {
  const stock = state.stocks.find((s) => s.id === roll.stockId);
  const lensId = effectiveLensAt(state, roll.id, frame);
  const filterId = effectiveFilterAt(state, roll.id, frame);
  const lens = lensId ? state.lenses.find((l) => l.id === lensId) : null;
  const filter = filterId ? state.filters.find((f) => f.id === filterId) : null;

  const rows: Array<[string, string]> = [
    ['Aperture', shot?.aperture ?? '—'],
    ['Shutter', shot?.shutter ?? '—'],
    ['Lens', lens?.name ?? '—'],
    ['Filter', filter?.name ?? '—'],
    ['Stock', roll.digital ? 'digital' : (stock?.name ?? '—')],
    ['ISO', roll.digital ? '—' : String(roll.iso)],
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
