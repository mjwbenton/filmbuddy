import { completedRollsForCamera, useAppState } from '../state';
import { useNav } from '../nav/context';
import { PastRollCard } from './PastRollCard';

type Props = { cameraId: string };

export function RollsTabList({ cameraId }: Props) {
  const { state } = useAppState();
  const { openScreen } = useNav();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const rolls = completedRollsForCamera(state, cameraId);

  if (rolls.length === 0) {
    return (
      <div className="rolls-empty">
        <div className="rolls-empty-title">No past rolls yet</div>
        <div>Finished rolls on {camera?.name ?? 'this camera'} will show up here.</div>
      </div>
    );
  }

  return (
    <div className="cards" style={{ padding: 0, gap: 10, marginTop: 10 }}>
      {rolls.map((r) => (
        <PastRollCard
          key={r.id}
          roll={r}
          onOpen={() => openScreen({ name: 'past-roll', cameraId, rollId: r.id })}
        />
      ))}
    </div>
  );
}
