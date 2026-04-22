import { Icon } from '../icons';
import { useNav } from '../nav/context';

export function AddCameraCard() {
  const { openSheet } = useNav();
  return (
    <button type="button" className="add-card" onClick={() => openSheet({ kind: 'add-camera' })}>
      <Icon name="plus" size={18} />
      Add camera
    </button>
  );
}
