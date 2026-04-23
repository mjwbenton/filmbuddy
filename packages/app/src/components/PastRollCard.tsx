import type { Roll } from '../state';
import { shotsForRoll, useAppState } from '../state';
import { Icon } from '../icons';

type Props = { roll: Roll; onOpen: () => void };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDateRange(startTs: number, endTs: number, now: number = Date.now()): string {
  const a = new Date(startTs);
  const b = new Date(endTs);
  const sameYear = a.getFullYear() === b.getFullYear();
  const thisYear = b.getFullYear() === new Date(now).getFullYear();
  const left = `${MONTHS[a.getMonth()]} ${a.getDate()}`;
  const rightSuffix = !thisYear || !sameYear ? `, ${b.getFullYear()}` : '';
  const right = `${MONTHS[b.getMonth()]} ${b.getDate()}${rightSuffix}`;
  return sameYear ? `${left} – ${right}` : `${left}, ${a.getFullYear()} – ${right}`;
}

export function PastRollCard({ roll, onOpen }: Props) {
  const { state } = useAppState();
  const stock = state.stocks.find((s) => s.id === roll.stockId);
  const shots = shotsForRoll(state, roll.id);
  const completedAt = roll.completedAt ?? roll.startedAt;

  const lensIds = [...new Set(shots.map((s) => s.lensId).filter((v): v is string => !!v))];
  const lensNames = lensIds
    .map((id) => state.lenses.find((l) => l.id === id)?.name)
    .filter((v): v is string => !!v);
  const lensLabel =
    lensNames.length === 0
      ? 'No lens logged'
      : lensNames.length <= 2
        ? lensNames.join(' · ')
        : `${lensNames.slice(0, 2).join(' · ')} +${lensNames.length - 2}`;

  return (
    <button type="button" className="past-roll" onClick={onOpen}>
      <div className="pr-head">
        <div className="pr-stock">{stock?.name ?? 'Unknown stock'}</div>
        <div className="pr-iso">
          ISO <span className="mono">{roll.iso}</span>
        </div>
      </div>
      <div className="pr-meta">
        {fmtDateRange(roll.startedAt, completedAt)}
        <span className="sep">•</span>
        <span className="mono">
          {shots.length}/{roll.length}
        </span>
        <span> logged</span>
      </div>
      <div className="pr-lenses">
        <Icon name="swap" size={12} />
        <span>{lensLabel}</span>
      </div>
    </button>
  );
}

export { fmtDateRange };
