import type { Camera } from '../state';
import { useAppState, currentRoll, currentLensId, currentFilterId } from '../state';
import { useNav } from '../nav/context';
import { Pill } from '../ui';
import { Icon } from '../icons';

type Props = { camera: Camera };

export function CameraCard({ camera }: Props) {
  const { state } = useAppState();
  const { openScreen, openSheet } = useNav();
  const roll = currentRoll(state, camera.id);
  const digital = roll?.digital === true;

  const stock = roll ? state.stocks.find((s) => s.id === roll.stockId) : null;
  const lensId = currentLensId(state, camera.id);
  const filterId = currentFilterId(state, camera.id);
  const lens = lensId ? state.lenses.find((l) => l.id === lensId) : null;
  const filter = filterId ? state.filters.find((f) => f.id === filterId) : null;

  const progressPct = roll && !digital ? Math.min(100, (roll.shotCount / roll.length) * 100) : 0;

  return (
    <div className="card">
      <div
        className="card-top tappable"
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
        onClick={() => openScreen({ name: 'camera', cameraId: camera.id })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openScreen({ name: 'camera', cameraId: camera.id });
          }
        }}
      >
        <div>
          <div className="cam-name">{camera.name}</div>
        </div>
        <div className="shot-counter">
          <div className="num mono">{roll?.shotCount ?? 0}</div>
          <div className="of">{digital ? 'digital' : roll ? `/ ${roll.length}` : 'no roll'}</div>
        </div>
      </div>

      {roll && !digital && (
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      {roll ? (
        digital ? (
          <div className="film-row">
            <span className="film-main">In-camera counter</span>
            <button
              type="button"
              className="chip"
              onClick={() => openSheet({ kind: 'change-shot', cameraId: camera.id })}
            >
              Set
            </button>
          </div>
        ) : (
          <div className="film-row">
            <span className="film-main">{stock?.name ?? 'Unknown stock'}</span>
            <span className="film-iso mono">ISO {roll.iso}</span>
          </div>
        )
      ) : (
        <div className="film-row">
          <span className="cam-empty-state">No film loaded</span>
          <button
            type="button"
            className="chip"
            onClick={() => openSheet({ kind: 'load-film', cameraId: camera.id })}
          >
            Load film
          </button>
        </div>
      )}

      <div className="pills">
        <Pill variant={lens ? 'accent' : 'ghost'}>
          <Icon name="lens" size={14} />
          {lens ? lens.name : 'no lens'}
        </Pill>
        <Pill variant={filter ? 'yellow' : 'ghost'}>
          <Icon name="filter" size={14} />
          {filter ? filter.name : 'no filter'}
        </Pill>
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="act-btn primary"
          disabled={!roll}
          onClick={() => openSheet({ kind: 'swap-lens-filter', cameraId: camera.id })}
        >
          <Icon name="swap" size={18} />
          Swap
        </button>
        <button
          type="button"
          className="act-btn"
          disabled={!roll}
          onClick={() => openSheet({ kind: 'log-shot', cameraId: camera.id })}
        >
          <Icon name="aperture" size={18} />
          Log shot
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
    </div>
  );
}
