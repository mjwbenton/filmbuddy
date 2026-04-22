import { useEffect, useRef } from 'react';
import type { Roll, Shot } from '../state';

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
            <span className={shot ? 'has-meta' : 'no-meta'} aria-hidden />
            <span className="exposure mono">
              {shot?.aperture && <>{shot.aperture}</>}
              {shot?.shutter && (
                <>
                  <br />
                  {shot.shutter}
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
