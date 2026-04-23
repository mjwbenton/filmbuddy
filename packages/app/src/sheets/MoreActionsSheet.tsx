import { useAppState, currentRoll } from '../state';
import { Sheet } from '../ui';
import { Icon } from '../icons';
import { useNav, type SheetState } from '../nav/context';

type Props = { cameraId: string };

type Action = {
  label: string;
  sub?: string | undefined;
  to: SheetState;
  disabled?: boolean | undefined;
};

export function MoreActionsSheet({ cameraId }: Props) {
  const { state } = useAppState();
  const { openSheet, closeSheet } = useNav();
  const camera = state.cameras.find((c) => c.id === cameraId);
  const roll = camera ? currentRoll(state, cameraId) : null;

  if (!camera) return null;
  const digital = roll?.digital === true;

  const actions: Action[] = [
    {
      label: roll ? 'Load new roll' : 'Load film',
      sub: roll ? 'Replaces the current roll' : undefined,
      to: { kind: 'load-film', cameraId },
    },
    {
      label: digital ? 'Set in-camera counter' : 'Change shot number',
      to: { kind: 'change-shot', cameraId },
      disabled: !roll,
    },
    {
      label: 'Mark roll complete',
      to: { kind: 'complete-roll', cameraId },
      disabled: !roll,
    },
  ];

  const route = (a: Action) => {
    if (a.disabled) return;
    closeSheet();
    // let close transition finish before we swap in the next sheet
    setTimeout(() => openSheet(a.to), 260);
  };

  return (
    <Sheet open title={camera.name} onClose={closeSheet}>
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          className="opt-row"
          onClick={() => route(a)}
          disabled={a.disabled}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            textAlign: 'left',
            opacity: a.disabled ? 0.4 : 1,
            cursor: a.disabled ? 'not-allowed' : 'pointer',
            padding: '12px 0',
          }}
        >
          <div className="ll">
            <div className="t">{a.label}</div>
            {a.sub && <div className="s">{a.sub}</div>}
          </div>
          <Icon name="chevron-right" size={18} />
        </button>
      ))}
    </Sheet>
  );
}
