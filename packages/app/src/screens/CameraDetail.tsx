import { useMemo, useState } from 'react';
import { useAppState, currentRoll, shotsForRoll, completedRollsForCamera } from '../state';
import { useNav } from '../nav/context';
import { FilmTimeline } from '../components/FilmTimeline';
import { DetailGrid } from '../components/DetailGrid';
import { BackupFooter } from '../components/BackupFooter';
import { RollsTabList } from '../components/RollsTabList';
import { Button } from '../ui';
import { Icon } from '../icons';

type Props = { cameraId: string };
type Tab = 'current' | 'rolls';

export function CameraDetail({ cameraId }: Props) {
  const { state } = useAppState();
  const { openScreen, openSheet } = useNav();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const roll = camera ? currentRoll(state, cameraId) : null;
  const shots = useMemo(() => (roll ? shotsForRoll(state, roll.id) : []), [state, roll]);
  const pastRolls = camera ? completedRollsForCamera(state, cameraId) : [];

  const initialFrame = roll?.digital
    ? Math.max(1, roll.shotCount)
    : Math.max(1, Math.min(roll?.shotCount ?? 1, roll?.length ?? 1));

  const [selectedFrame, setSelectedFrame] = useState(initialFrame);
  const [tab, setTab] = useState<Tab>('current');

  if (!camera) {
    return (
      <div className="page" style={{ padding: 'var(--pad)' }}>
        <p>Camera not found.</p>
        <Button variant="ghost" onClick={() => openScreen({ name: 'home' })}>
          Back
        </Button>
      </div>
    );
  }

  const digital = roll?.digital === true;
  const selectedShot = shots.find((s) => s.frame === selectedFrame) ?? null;
  const progressPct = roll && !digital ? Math.min(100, (roll.shotCount / roll.length) * 100) : 0;
  const showTabs = !digital && pastRolls.length > 0;

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <button type="button" className="nav-back" onClick={() => openScreen({ name: 'home' })}>
        <Icon name="chevron-left" size={16} /> Cameras
      </button>

      <div className="detail-header">
        <h1>{camera.name}</h1>
      </div>

      {showTabs && (
        <div className="cam-tabs" role="tablist">
          <button
            type="button"
            className={`cam-tab ${tab === 'current' ? 'active' : ''}`}
            role="tab"
            aria-selected={tab === 'current'}
            onClick={() => setTab('current')}
          >
            Current roll
          </button>
          <button
            type="button"
            className={`cam-tab ${tab === 'rolls' ? 'active' : ''}`}
            role="tab"
            aria-selected={tab === 'rolls'}
            onClick={() => setTab('rolls')}
          >
            Rolls
            <span className="badge">{pastRolls.length}</span>
          </button>
        </div>
      )}

      <div style={{ padding: '0 var(--pad)' }}>
        {tab === 'rolls' ? (
          <RollsTabList cameraId={camera.id} />
        ) : roll ? (
          <>
            <FilmTimeline
              roll={roll}
              shots={shots}
              selectedFrame={selectedFrame}
              onSelectFrame={setSelectedFrame}
            />
            {!digital && (
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            )}
            <DetailGrid state={state} roll={roll} shot={selectedShot} frame={selectedFrame} />
            <div className="card-actions" style={{ marginTop: 12 }}>
              <button
                type="button"
                className="act-btn primary"
                disabled={!roll}
                onClick={() => openSheet({ kind: 'swap-lens-filter', cameraId: camera.id })}
              >
                <Icon name="swap" size={18} />
                Swap lens
              </button>
              <button
                type="button"
                className="act-btn"
                onClick={() =>
                  openSheet({
                    kind: 'log-shot',
                    cameraId: camera.id,
                    ...(selectedShot ? { editShotId: selectedShot.id } : {}),
                  })
                }
              >
                <Icon name="notebook" size={18} />
                {selectedShot ? 'Edit shot' : 'Log shot'}
              </button>
              <button
                type="button"
                className="act-btn"
                onClick={() => openSheet({ kind: 'more', cameraId: camera.id })}
              >
                <Icon name="more" size={18} />
                More
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ padding: '40px 0' }}>
            <p style={{ marginBottom: 12 }}>No roll loaded.</p>
            <Button
              variant="accent"
              onClick={() => openSheet({ kind: 'load-film', cameraId: camera.id })}
            >
              Load film
            </Button>
          </div>
        )}
      </div>

      <BackupFooter />
    </div>
  );
}
