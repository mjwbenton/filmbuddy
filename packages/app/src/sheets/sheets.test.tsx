import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { STATE_KEY } from '../state';

function reset() {
  localStorage.clear();
}

describe('add camera flow', () => {
  beforeEach(reset);

  it('creates a camera via AddCameraSheet', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText('Add camera'));
    const dialog = await screen.findByRole('dialog', { name: 'Add camera' });
    expect(dialog).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText('Leica M6, Mamiya 7, …');
    await user.type(nameInput, 'M6');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(await screen.findByText('M6')).toBeInTheDocument();
  });
});

describe('load film flow', () => {
  beforeEach(reset);

  it('loads film onto an existing analogue camera', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify({
        cameras: [{ id: 'c1', name: 'M6', type: '35mm Rangefinder' }],
        rolls: [],
        shots: [],
        stocks: [],
        lenses: [],
        filters: [],
        backupKey: 'fb-aaaa-aaaa-aaaa',
        lastBackupAt: null,
      }),
    );
    render(<App />);
    await user.click(screen.getByText('Load film'));
    const dialog = await screen.findByRole('dialog', { name: 'Load film' });
    expect(dialog).toBeInTheDocument();
    const stockInput = screen.getByPlaceholderText('Portra 400, Tri-X, …');
    await user.type(stockInput, 'Tri-X');
    await user.click(screen.getByRole('button', { name: 'Load' }));
    // Roll loaded → film-row now shows stock + ISO
    expect(await screen.findByText('Tri-X')).toBeInTheDocument();
    expect(screen.getByText('ISO 400')).toBeInTheDocument();
  });
});

describe('log shot flow', () => {
  beforeEach(reset);

  it('logs a shot for the active roll', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify({
        cameras: [{ id: 'c1', name: 'M6', type: '35mm Rangefinder', currentRollId: 'r1' }],
        rolls: [
          {
            id: 'r1',
            cameraId: 'c1',
            stockId: 's1',
            iso: 400,
            length: 36,
            startedAt: 0,
            completedAt: null,
            shotCount: 2,
          },
        ],
        shots: [],
        stocks: [{ id: 's1', name: 'Tri-X', boxSpeed: 400 }],
        lenses: [],
        filters: [],
        backupKey: 'fb-aaaa-aaaa-aaaa',
        lastBackupAt: null,
      }),
    );
    render(<App />);
    // Multiple Log shot buttons may exist (card action + detail); pick the card one
    const logBtn = screen.getAllByText('Log shot')[0]!;
    await user.click(logBtn);
    const dialog = await screen.findByRole('dialog', { name: 'Log shot' });
    expect(dialog).toBeInTheDocument();
    const aperture = screen.getByPlaceholderText('f/5.6');
    fireEvent.change(aperture, { target: { value: 'f/2.8' } });
    const shutter = screen.getByPlaceholderText('1/250');
    fireEvent.change(shutter, { target: { value: '1/250' } });
    await user.click(screen.getByRole('button', { name: 'Log' }));
    // After submit the shot count on the card shows 3
    expect(await screen.findByText('3')).toBeInTheDocument();
  });
});
