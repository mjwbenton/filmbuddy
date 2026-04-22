import type { Camera } from '../state';
import { useAppState, currentRoll, isDigitalType } from '../state';
import { useNav } from '../nav/context';

type Props = { camera: Camera };

export function ListRow({ camera }: Props) {
  const { state } = useAppState();
  const { openScreen } = useNav();
  const roll = currentRoll(state, camera.id);
  const digital = isDigitalType(camera.type);
  const stock = roll ? state.stocks.find((s) => s.id === roll.stockId) : null;
  const lens = camera.lensId ? state.lenses.find((l) => l.id === camera.lensId) : null;
  const filter = camera.filterId ? state.filters.find((f) => f.id === camera.filterId) : null;

  const subParts = [
    roll ? `${stock?.name ?? 'roll'} @ ${roll.iso}` : 'no film',
    lens?.name,
    filter?.name,
  ].filter(Boolean);

  return (
    <div
      className="list-row"
      role="button"
      tabIndex={0}
      onClick={() => openScreen({ name: 'camera', cameraId: camera.id })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openScreen({ name: 'camera', cameraId: camera.id });
        }
      }}
    >
      <div className="left">
        <div className="cam-name">{camera.name}</div>
        <div className="cam-sub">{subParts.join(' · ')}</div>
      </div>
      <div className="right">
        <div className="num mono">{roll?.shotCount ?? 0}</div>
        <div className="of">{digital ? 'digital' : roll ? `/ ${roll.length}` : ''}</div>
      </div>
    </div>
  );
}
