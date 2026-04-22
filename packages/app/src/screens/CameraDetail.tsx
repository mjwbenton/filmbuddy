import { useMemo, useState } from 'react';
import { useAppState, currentRoll, shotsForRoll, isDigitalType } from '../state';
import { useNav } from '../nav/context';
import { FilmTimeline } from '../components/FilmTimeline';
import { DetailGrid } from '../components/DetailGrid';
import { BackupFooter } from '../components/BackupFooter';
import { Button } from '../ui';
import { Icon } from '../icons';

type Props = { cameraId: string };

export function CameraDetail({ cameraId }: Props) {
  const { state } = useAppState();
  const { openScreen, openSheet } = useNav();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const roll = camera ? currentRoll(state, cameraId) : null;
  const shots = useMemo(() => (roll ? shotsForRoll(state, roll.id) : []), [state, roll]);

  const initialFrame = roll?.digital
    ? Math.max(1, roll.shotCount)
    : Math.max(1, Math.min(roll?.shotCount ?? 1, roll?.length ?? 1));

  const [selectedFrame, setSelectedFrame] = useState(initialFrame);

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

  const digital = isDigitalType(camera.type);
  const selectedShot = shots.find((s) => s.frame === selectedFrame) ?? null;
  const progressPct = roll && !digital ? Math.min(100, (roll.shotCount / roll.length) * 100) : 0;

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <button type="button" className="nav-back" onClick={() => openScreen({ name: 'home' })}>
        <Icon name="chevron-left" size={16} /> Cameras
      </button>

      <div className="detail-header">
        <h1>{camera.name}</h1>
        <div className="sub">{camera.type}</div>
      </div>

      <div style={{ padding: '0 var(--pad)' }}>
        {roll ? (
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
            <DetailGrid state={state} roll={roll} shot={selectedShot} />
            <div className="as-grid" style={{ marginTop: 8 }}>
              <Button
                variant="accent"
                onClick={() =>
                  openSheet({
                    kind: 'log-shot',
                    cameraId: camera.id,
                    ...(selectedShot ? { editShotId: selectedShot.id } : {}),
                  })
                }
              >
                {selectedShot ? 'Edit shot' : 'Log shot'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => openSheet({ kind: 'more', cameraId: camera.id })}
              >
                More actions
              </Button>
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
