import { useAppState } from '../state';
import { CameraCard } from '../components/CameraCard';
import { ListRow } from '../components/ListRow';
import { AddCameraCard } from '../components/AddCameraCard';
import { StaleBackupBanner } from '../components/StaleBackupBanner';
import { BackupFooter } from '../components/BackupFooter';
import { Seg } from '../ui';

export function Home() {
  const { state, mutators } = useAppState();
  const { cameras, homeLayout } = state;

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <StaleBackupBanner />

      <div className="section-label">
        <span>Your cameras</span>
        <span className="count">
          {cameras.length > 0 && (
            <Seg
              value={homeLayout}
              onChange={(l) => mutators.setHomeLayout(l)}
              options={[
                { value: 'stacked', label: 'Cards' },
                { value: 'list', label: 'List' },
              ]}
            />
          )}
        </span>
      </div>

      {cameras.length === 0 ? (
        <>
          <div className="empty-state">No cameras yet. Add your first one to start logging.</div>
          <div className="cards">
            <AddCameraCard />
          </div>
        </>
      ) : (
        <div className="cards" style={homeLayout === 'list' ? { gap: 6 } : undefined}>
          {cameras.map((c) =>
            homeLayout === 'list' ? (
              <ListRow key={c.id} camera={c} />
            ) : (
              <CameraCard key={c.id} camera={c} />
            ),
          )}
          <AddCameraCard />
        </div>
      )}

      <BackupFooter />
    </div>
  );
}
