// Tweaks panel — accent, layout, density, theme

const ACCENT_PRESETS = [
  { id: 175, label: "Teal" },
  { id: 25,  label: "Film orange" },
  { id: 260, label: "Indigo" },
  { id: 145, label: "Forest" },
  { id: 340, label: "Magenta" },
  { id: 55,  label: "Amber" },
];

function TweaksPanel({ tweaks, setTweaks, visible, onClose }) {
  if (!visible) return null;
  const set = (patch) => setTweaks({ ...tweaks, ...patch });
  return (
    <div className="tweaks-panel" role="dialog" aria-label="Tweaks">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h4 style={{ margin: 0 }}>Tweaks</h4>
        <button className="icon-btn" onClick={onClose}><Icon name="x" size={16} /></button>
      </div>
      <div className="tweak-row">
        <div className="tweak-row-label">Accent color</div>
        <div className="swatches">
          {ACCENT_PRESETS.map((p) => (
            <button
              key={p.id}
              className={`swatch ${tweaks.accentHue === p.id ? "selected" : ""}`}
              title={p.label}
              style={{ background: `oklch(0.62 0.10 ${p.id})` }}
              onClick={() => set({ accentHue: p.id })}
            />
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <div className="tweak-row-label">Theme</div>
        <div className="seg">
          <button className={`seg-opt ${tweaks.theme === "light" ? "active" : ""}`} onClick={() => set({ theme: "light" })}>Light</button>
          <button className={`seg-opt ${tweaks.theme === "dark" ? "active" : ""}`} onClick={() => set({ theme: "dark" })}>Dark</button>
        </div>
      </div>
      <div className="tweak-row">
        <div className="tweak-row-label">Home layout</div>
        <div className="seg">
          <button className={`seg-opt ${tweaks.homeLayout === "stacked" ? "active" : ""}`} onClick={() => set({ homeLayout: "stacked" })}>Stacked</button>
          <button className={`seg-opt ${tweaks.homeLayout === "list" ? "active" : ""}`} onClick={() => set({ homeLayout: "list" })}>Compact</button>
        </div>
      </div>
      <div className="tweak-row">
        <div className="tweak-row-label">Density</div>
        <div className="seg">
          <button className={`seg-opt ${tweaks.density === "comfortable" ? "active" : ""}`} onClick={() => set({ density: "comfortable" })}>Comfortable</button>
          <button className={`seg-opt ${tweaks.density === "compact" ? "active" : ""}`} onClick={() => set({ density: "compact" })}>Compact</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TweaksPanel, ACCENT_PRESETS });
