import { useEffect, useRef } from 'react';
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
  const visibleFrames = Math.max(roll.digital ? roll.shotCount + 1 : roll.length, 1);

  useEffect(() => {
    const el = trackRef.current?.querySelector<HTMLButtonElement>(
      `[data-frame="${selectedFrame}"]`,
    );
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedFrame]);

  return (
    <div className="timeline" ref={trackRef}>
      {Array.from({ length: visibleFrames }, (_, i) => i + 1).map((frame) => {
        const shot = shots.find((s) => s.frame === frame);
        const isCurrent = frame === selectedFrame;
        const beyond = !roll.digital && frame > roll.shotCount;
        const hasLog = !!(shot && (shot.aperture || shot.shutter || shot.note));
        const hasSwap = !!(shot && (shot.lensId !== undefined || shot.filterId !== undefined));
        return (
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
          </button>
        );
      })}
    </div>
  );
}
