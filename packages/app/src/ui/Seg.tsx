type SegOption<V extends string> = { value: V; label: string };

type SegProps<V extends string> = {
  value: V;
  onChange: (value: V) => void;
  options: SegOption<V>[];
};

export function Seg<V extends string>({ value, onChange, options }: SegProps<V>) {
  return (
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className={['seg-opt', o.value === value && 'active'].filter(Boolean).join(' ')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
