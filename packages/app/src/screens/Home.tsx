import { useAppState } from '../state';
import { CameraCard } from '../components/CameraCard';
import { AddCameraCard } from '../components/AddCameraCard';
import { StaleBackupBanner } from '../components/StaleBackupBanner';
import { BackupFooter } from '../components/BackupFooter';

export function Home() {
  const { state } = useAppState();
  const { cameras } = state;

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <StaleBackupBanner />

      <div className="section-label">
        <span>Your cameras</span>
      </div>

      {cameras.length === 0 ? (
        <>
          <div className="empty-state">No cameras yet. Add your first one to start logging.</div>
          <div className="cards">
            <AddCameraCard />
          </div>
        </>
      ) : (
        <div className="cards">
          {cameras.map((c) => (
            <CameraCard key={c.id} camera={c} />
          ))}
          <AddCameraCard />
        </div>
      )}

      <BackupFooter />
    </div>
  );
}
