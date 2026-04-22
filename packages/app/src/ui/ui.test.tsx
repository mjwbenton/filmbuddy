import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SuggestInput } from './SuggestInput';
import { Sheet } from './Sheet';
import { ToastProvider, useToast } from './Toast';
import { useState } from 'react';

function SuggestHarness({ initial = '' }: { initial?: string }) {
  const [v, setV] = useState(initial);
  return (
    <SuggestInput value={v} onChange={setV} suggestions={['Portra 400', 'Tri-X 400', 'HP5']} />
  );
}

describe('SuggestInput', () => {
  it('filters suggestions based on typed text', async () => {
    const user = userEvent.setup();
    render(<SuggestHarness />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(screen.getByText('Portra 400')).toBeInTheDocument();
    expect(screen.getByText('Tri-X 400')).toBeInTheDocument();
    await user.type(input, 'tri');
    expect(screen.queryByText('Portra 400')).not.toBeInTheDocument();
    expect(screen.getByText('Tri-X 400')).toBeInTheDocument();
  });

  it('clicking a chip commits it to the input', async () => {
    const user = userEvent.setup();
    render(<SuggestHarness />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);
    await user.click(screen.getByText('HP5'));
    expect(input.value).toBe('HP5');
  });
});

describe('Sheet', () => {
  function SheetHarness({ onClose }: { onClose: () => void }) {
    return (
      <Sheet open title="Load film" onClose={onClose}>
        <div>body content</div>
      </Sheet>
    );
  }

  it('renders title and body when open', () => {
    render(<SheetHarness onClose={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Load film' })).toBeInTheDocument();
    expect(screen.getByText('body content')).toBeInTheDocument();
  });

  it('scrim click triggers onClose', async () => {
    const onClose = vi.fn();
    const { container } = render(<SheetHarness onClose={onClose} />);
    const scrim = container.querySelector('.sheet-scrim');
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Cancel button triggers onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SheetHarness onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('Toast', () => {
  function ToastHarness() {
    const toast = useToast();
    return <button onClick={() => toast('Loaded Tri-X @ 400')}>fire</button>;
  }

  it('shows message on fire and auto-dismisses after ~2s', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('fire'));
    expect(screen.getByRole('status')).toHaveTextContent('Loaded Tri-X @ 400');
    expect(screen.getByRole('status').className).toContain('show');
    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(screen.getByRole('status').className).not.toContain('show');
    vi.useRealTimers();
  });
});
