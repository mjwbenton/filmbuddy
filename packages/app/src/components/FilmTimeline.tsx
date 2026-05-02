import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Roll, Shot } from '../state';
import { Icon } from '../icons';

type Props = {
  roll: Roll;
  shots: Shot[];
  selectedFrame: number;
  onSelectFrame: (frame: number) => void;
};

export function FilmTimeline({ roll, shots, selectedFrame, onSelectFrame }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const framesToRender = useMemo<number[]>(() => {
    if (!roll.digital) {
      return Array.from({ length: Math.max(roll.length, 1) }, (_, i) => i + 1);
    }
    const start = Math.max(1, roll.shotCount - 200);
    const end = roll.shotCount + 200;
    const set = new Set<number>();
    for (let f = start; f <= end; f++) set.add(f);
    for (const s of shots) {
      if (s.frame >= 1) set.add(s.frame);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [roll.digital, roll.shotCount, roll.length, shots]);

  useEffect(() => {
    const el = trackRef.current?.querySelector<HTMLButtonElement>(
      `[data-frame="${selectedFrame}"]`,
    );
    el?.scrollIntoView?.({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedFrame]);

  const items: ReactNode[] = [];
  let prev: number | null = null;
  for (const frame of framesToRender) {
    if (prev !== null && frame !== prev + 1) {
      items.push(
        <span className="frame-gap" aria-hidden key={`gap-${prev}-${frame}`}>
          …
        </span>,
      );
    }
    const shot = shots.find((s) => s.frame === frame);
    const isCurrent = frame === selectedFrame;
    const beyond = !roll.digital && frame > roll.shotCount;
    const hasLog = !!(shot && (shot.aperture || shot.shutter || shot.note));
    const hasSwap = !!(shot && (shot.lensId !== undefined || shot.filterId !== undefined));
    items.push(
      <button
        type="button"
        key={frame}
        data-frame={frame}
        className={['frame', isCurrent && 'current', beyond && !shot && 'empty']
          .filter(Boolean)
          .join(' ')}
        onClick={() => onSelectFrame(frame)}
      >
        <span className="fn mono">{frame}</span>
        <span className="frame-marks" aria-hidden>
          {hasLog && <span className="frame-dot" />}
          {hasSwap && <Icon name="swap" size={14} />}
        </span>
      </button>,
    );
    prev = frame;
  }

  return (
    <div className="timeline" ref={trackRef}>
      {items}
    </div>
  );
}
