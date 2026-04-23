import { useMemo, useState } from 'react';
import { useAppState, shotsForRoll, relTime } from '../state';
import { useNav } from '../nav/context';
import { FilmTimeline } from '../components/FilmTimeline';
import { DetailGrid } from '../components/DetailGrid';
import { BackupFooter } from '../components/BackupFooter';
import { fmtDateRange } from '../components/PastRollCard';
import { Button } from '../ui';
import { Icon } from '../icons';

type Props = { cameraId: string; rollId: string };

export function PastRollDetail({ cameraId, rollId }: Props) {
  const { state } = useAppState();
  const { openScreen, openSheet } = useNav();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const roll = state.rolls.find((r) => r.id === rollId);
  const shots = useMemo(() => (roll ? shotsForRoll(state, roll.id) : []), [state, roll]);

  const initialFrame = useMemo(() => {
    if (!roll) return 1;
    const firstLogged = shots[0]?.frame;
    return Math.max(1, firstLogged ?? 1);
  }, [roll, shots]);

  const [selectedFrame, setSelectedFrame] = useState(initialFrame);

  if (!camera || !roll) {
    return (
      <div className="page" style={{ padding: 'var(--pad)' }}>
        <p>Roll not found.</p>
        <Button variant="ghost" onClick={() => openScreen({ name: 'home' })}>
          Back
        </Button>
      </div>
    );
  }

  const stock = state.stocks.find((s) => s.id === roll.stockId);
  const selectedShot = shots.find((s) => s.frame === selectedFrame) ?? null;
  const completedAt = roll.completedAt ?? roll.startedAt;
  const progressPct = Math.min(100, (shots.length / roll.length) * 100);

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <button
        type="button"
        className="nav-back"
        onClick={() => openScreen({ name: 'camera', cameraId })}
      >
        <Icon name="chevron-left" size={16} /> {camera.name}
      </button>

      <div className="detail-header">
        <h1>{stock?.name ?? 'Roll'}</h1>
        <div className="sub">
          ISO <span className="mono">{roll.iso}</span> · {fmtDateRange(roll.startedAt, completedAt)}{' '}
          · completed {relTime(completedAt)}
        </div>
      </div>

      <div style={{ padding: '0 var(--pad)' }}>
        <FilmTimeline
          roll={roll}
          shots={shots}
          selectedFrame={selectedFrame}
          onSelectFrame={setSelectedFrame}
        />
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <DetailGrid state={state} roll={roll} shot={selectedShot} frame={selectedFrame} />
        <div style={{ marginTop: 16 }}>
          <Button
            variant="ghost"
            onClick={() => openSheet({ kind: 'delete-roll', cameraId, rollId })}
            style={{ color: 'var(--danger)' }}
          >
            Delete roll
          </Button>
        </div>
      </div>

      <BackupFooter />
    </div>
  );
}
