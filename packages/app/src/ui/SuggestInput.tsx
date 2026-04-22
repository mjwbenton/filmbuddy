import { useMemo, useState, type InputHTMLAttributes } from 'react';
import { Chip } from './Chip';

type SuggestInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  maxChips?: number;
};

export function SuggestInput({
  value,
  onChange,
  suggestions,
  maxChips = 12,
  className,
  ...rest
}: SuggestInputProps) {
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    const matches = q
      ? suggestions.filter((s) => s.toLowerCase().includes(q) && s.toLowerCase() !== q)
      : suggestions;
    return matches.slice(0, maxChips);
  }, [value, suggestions, maxChips]);

  return (
    <div>
      <input
        className={['input', className].filter(Boolean).join(' ')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {(focused || value === '') && filtered.length > 0 && (
        <div className="suggest-chips">
          {filtered.map((s) => (
            <Chip
              key={s}
              selected={s.toLowerCase() === value.toLowerCase()}
              // prevent input blur before click fires
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onChange(s)}
            >
              {s}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
