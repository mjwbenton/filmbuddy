
// ===== app/icons.jsx =====
// Minimal stroke icons — lucide-style, 1.75 stroke, 20px default
const Icon = ({ name, size = 20, stroke = 1.75, ...rest }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...rest,
  };
  switch (name) {
    case "camera":
      return (
        <svg {...common}>
          <path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case "aperture":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v8l7 4M12 21v-8l-7-4M21 12h-8l-3.5 6.5M3 12h8l3.5-6.5" />
        </svg>
      );
    case "film-frame":
      return (
        <svg {...common}>
          <rect x="4" y="7" width="16" height="10" rx="1.2" />
          <circle cx="7" cy="10" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="10.3" cy="10" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="13.7" cy="10" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="17" cy="10" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="7" cy="14" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="10.3" cy="14" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="13.7" cy="14" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="17" cy="14" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "lens":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M5 9h14M5 15h14" />
        </svg>
      );
    case "film":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 9h2M3 13h2M3 17h2M19 9h2M19 13h2M19 17h2M8 5v14M16 5v14" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "plus-sm":
      return (
        <svg {...common} viewBox="0 0 16 16">
          <path d="M8 3v10M3 8h10" />
        </svg>
      );
    case "swap":
      return (
        <svg {...common}>
          <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
        </svg>
      );
    case "note":
      return (
        <svg {...common}>
          <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
          <path d="M8 10h8M8 14h6" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...common}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case "chevron-left":
      return (
        <svg {...common}>
          <path d="m15 6-6 6 6 6" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 5 5 9-11" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
        </svg>
      );
    case "upload":
      return (
        <svg {...common}>
          <path d="M12 17V5M7 10l5-5 5 5M4 19h16" />
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <path d="M12 5v12M7 12l5 5 5-5M4 19h16" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common}>
          <path d="M12 3 2 20h20L12 3Z" />
          <path d="M12 10v4M12 17.5v.01" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...common}>
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="10" cy="12" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    case "rotate":
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      );
    case "more":
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 3v18M5 5h12l-2 4 2 4H5" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M17 17H7a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9.1a4 4 0 0 1-1 7.9Z" />
        </svg>
      );
    case "copy":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
        </svg>
      );
    default:
      return null;
  }
};

window.Icon = Icon;


// ===== app/state.jsx =====
// State store — single immutable object, React context

const STATE_KEY = "filmbuddy.state.v2";
const TWEAKS_KEY = "filmbuddy.tweaks.v1";

const loadSeed = () => {
  const raw = document.getElementById("seed-state").textContent;
  return JSON.parse(raw);
};

const loadState = () => {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return loadSeed();
};

const saveState = (s) => {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (e) {}
};

const loadTweaks = () => {
  try {
    const stored = localStorage.getItem(TWEAKS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  const raw = document.getElementById("tweaks-default").textContent;
  const match = raw.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : { accentHue: 175, theme: "light", density: "comfortable", homeLayout: "stacked" };
};

const saveTweaks = (t) => {
  try { localStorage.setItem(TWEAKS_KEY, JSON.stringify(t)); } catch (e) {}
};

// Helpers
const byId = (arr, id) => (arr || []).find((x) => x.id === id);
const rollForCamera = (state, camId) => {
  const cam = byId(state.cameras, camId);
  return cam && cam.currentRollId ? byId(state.rolls, cam.currentRollId) : null;
};
const shotsForRoll = (state, rollId) =>
  state.shots.filter((s) => s.rollId === rollId).sort((a, b) => a.frame - b.frame);
const latestShotForRoll = (state, rollId) => {
  const ss = shotsForRoll(state, rollId);
  return ss.length ? ss[ss.length - 1] : null;
};

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const relTime = (ts) => {
  if (!ts) return "never";
  const now = Date.now();
  const diff = now - ts;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (d >= 1) return `${d} day${d === 1 ? "" : "s"} ago`;
  const h = Math.floor(diff / (1000 * 60 * 60));
  if (h >= 1) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const m = Math.max(1, Math.floor(diff / (1000 * 60)));
  return `${m} min${m === 1 ? "" : "s"} ago`;
};

const daysSince = (ts) => (ts ? Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24)) : Infinity);

// default roll length by camera type
const defaultLengthFor = (cam) => {
  if (!cam) return 36;
  if (/Medium/i.test(cam.type)) return 10;
  if (/Digital/i.test(cam.type)) return 9999;
  return 36;
};

window.FB = {
  STATE_KEY, TWEAKS_KEY,
  loadState, saveState, loadTweaks, saveTweaks,
  byId, rollForCamera, shotsForRoll, latestShotForRoll,
  uid, relTime, daysSince, defaultLengthFor,
};


// ===== app/sheets.jsx =====
// Bottom sheets for all mutation flows
const { useState, useEffect, useMemo, useRef } = React;

// -------- Generic sheet shell --------
function Sheet({ open, onClose, title, actionLabel, onAction, actionDisabled, children, leftAction }) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) setMounted(true);
    else {
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);
  if (!mounted) return null;
  return (
    <>
      <div className={`sheet-scrim ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`sheet ${open ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="sheet-grabber" />
        <div className="sheet-head">
          {leftAction ? leftAction : <button className="sheet-close" onClick={onClose}>Cancel</button>}
          <div className="sheet-title">{title}</div>
          {actionLabel ? (
            <button className="sheet-action" onClick={onAction} disabled={actionDisabled}>{actionLabel}</button>
          ) : <span style={{ width: 52 }} />}
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}

// -------- Free-text input with suggestion chips --------
function SuggestInput({ value, onChange, placeholder, suggestions = [], autoFocus }) {
  const ref = useRef(null);
  useEffect(() => { if (autoFocus && ref.current) setTimeout(() => ref.current.focus(), 260); }, [autoFocus]);
  return (
    <>
      <input ref={ref} className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {suggestions.length > 0 && (
        <div className="suggest-chips">
          {suggestions.map((s) => (
            <button key={s} className={`chip ${value === s ? "selected" : ""}`} onClick={() => onChange(s)}>{s}</button>
          ))}
        </div>
      )}
    </>
  );
}

// -------- Load film (start a roll) --------
function LoadFilmSheet({ state, setState, cameraId, open, onClose, onDone }) {
  const cam = FB.byId(state.cameras, cameraId);
  const [stockName, setStockName] = useState("");
  const [iso, setIso] = useState("");
  const [length, setLength] = useState("");

  useEffect(() => {
    if (open && cam) {
      setStockName("");
      setIso("");
      setLength(String(FB.defaultLengthFor(cam)));
    }
  }, [open, cameraId]);

  if (!cam) return null;
  const stockSuggestions = state.stocks.map((s) => s.name);
  const isoSuggestions = ["100", "200", "400", "800", "1600", "3200"];
  const canSubmit = stockName.trim() && iso;

  const handleLoad = () => {
    setState((s) => {
      let stocks = s.stocks;
      let stock = stocks.find((x) => x.name.toLowerCase() === stockName.trim().toLowerCase());
      if (!stock) {
        stock = { id: FB.uid("stock"), name: stockName.trim(), boxSpeed: Number(iso) };
        stocks = [...stocks, stock];
      }
      const roll = {
        id: FB.uid("roll"),
        cameraId,
        stockId: stock.id,
        iso: Number(iso),
        length: Number(length) || FB.defaultLengthFor(cam),
        startedAt: Date.now(),
        completedAt: null,
        shotCount: 0,
      };
      const cameras = s.cameras.map((c) => c.id === cameraId ? { ...c, currentRollId: roll.id } : c);
      return { ...s, stocks, rolls: [...s.rolls, roll], cameras };
    });
    onDone && onDone(`Loaded ${stockName.trim()} @ ISO ${iso}`);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={`Load film — ${cam.name}`} actionLabel="Load" onAction={handleLoad} actionDisabled={!canSubmit}>
      <div className="field">
        <label className="field-label">Film stock</label>
        <SuggestInput value={stockName} onChange={setStockName} placeholder="e.g. Kodak Tri-X 400" suggestions={stockSuggestions} autoFocus />
      </div>
      <div className="field">
        <label className="field-label">Shooting at ISO</label>
        <SuggestInput value={iso} onChange={setIso} placeholder="400" suggestions={isoSuggestions} />
      </div>
      <div className="field">
        <label className="field-label">Roll length (exposures)</label>
        <input className="input mono" value={length} onChange={(e) => setLength(e.target.value.replace(/\D/g, ""))} placeholder={String(FB.defaultLengthFor(cam))} inputMode="numeric" />
      </div>
    </Sheet>
  );
}

// -------- Swap lens + filter (the priority quick-entry) --------
function SwapLensFilterSheet({ state, setState, cameraId, open, onClose, onDone }) {
  const cam = FB.byId(state.cameras, cameraId);
  const [lensName, setLensName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [noFilter, setNoFilter] = useState(false);
  const [startFrame, setStartFrame] = useState(1);

  useEffect(() => {
    if (open && cam) {
      const curLens = FB.byId(state.lenses, cam.lensId);
      const curFilter = FB.byId(state.filters, cam.filterId);
      setLensName(curLens ? curLens.name : "");
      setFilterName(curFilter ? curFilter.name : "");
      setNoFilter(!cam.filterId);
      const r = FB.rollForCamera(state, cameraId);
      setStartFrame(r ? r.shotCount + 1 : 1);
    }
  }, [open, cameraId]);

  if (!cam) return null;

  const lensSuggestions = state.lenses.map((l) => l.name);
  const filterSuggestions = state.filters.map((f) => f.name);
  const canSubmit = lensName.trim().length > 0;

  const handleSwap = () => {
    setState((s) => {
      let lenses = s.lenses;
      let lens = lenses.find((l) => l.name.toLowerCase() === lensName.trim().toLowerCase());
      if (!lens) {
        lens = { id: FB.uid("lens"), name: lensName.trim() };
        lenses = [...lenses, lens];
      }
      let filters = s.filters;
      let filterId = null;
      if (!noFilter && filterName.trim()) {
        let filter = filters.find((f) => f.name.toLowerCase() === filterName.trim().toLowerCase());
        if (!filter) {
          filter = { id: FB.uid("filter"), name: filterName.trim() };
          filters = [...filters, filter];
        }
        filterId = filter.id;
      }
      const cameras = s.cameras.map((c) => c.id === cameraId ? { ...c, lensId: lens.id, filterId } : c);
      return { ...s, lenses, filters, cameras };
    });
    onDone && onDone("Lens + filter updated");
    onClose();
  };

  const roll = FB.rollForCamera(state, cameraId);

  return (
    <Sheet open={open} onClose={onClose} title="Swap lens / filter" actionLabel="Save" onAction={handleSwap} actionDisabled={!canSubmit}>
      {roll && (
        <div className="field">
          <label className="field-label">Takes effect from frame</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="icon-btn" onClick={() => setStartFrame((f) => Math.max(1, f - 1))} style={{ border: "1px solid var(--line)", width: 44, height: 44 }}>
              <Icon name="chevron-left" size={18} />
            </button>
            <div className="mono" style={{ fontSize: 28, fontWeight: 600, flex: 1, textAlign: "center" }}>#{startFrame}</div>
            <button className="icon-btn" onClick={() => setStartFrame((f) => f + 1)} style={{ border: "1px solid var(--line)", width: 44, height: 44 }}>
              <Icon name="chevron-right" size={18} />
            </button>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6, textAlign: "center" }}>
            Default is the next frame on {cam.name}.
          </div>
        </div>
      )}
      <div className="field">
        <label className="field-label">Lens</label>
        <SuggestInput value={lensName} onChange={setLensName} placeholder="e.g. Summicron 50mm f/2" suggestions={lensSuggestions} autoFocus />
      </div>
      <div className="field">
        <label className="field-label">Filter</label>
        <div className="seg" style={{ marginBottom: 10 }}>
          <button className={`seg-opt ${noFilter ? "active" : ""}`} onClick={() => setNoFilter(true)}>None</button>
          <button className={`seg-opt ${!noFilter ? "active" : ""}`} onClick={() => setNoFilter(false)}>With filter</button>
        </div>
        {!noFilter && (
          <SuggestInput value={filterName} onChange={setFilterName} placeholder="e.g. Yellow K2" suggestions={filterSuggestions} />
        )}
      </div>
    </Sheet>
  );
}

// -------- Add camera --------
function AddCameraSheet({ state, setState, open, onClose, onDone }) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("analogue");
  const [rollLength, setRollLength] = useState("36");
  useEffect(() => { if (open) { setName(""); setKind("analogue"); setRollLength("36"); } }, [open]);
  const canSubmit = name.trim() && (kind === "digital" || (rollLength && Number(rollLength) > 0));
  const handleAdd = () => {
    const isDig = kind === "digital";
    setState((s) => {
      const camId = FB.uid("cam");
      const cam = {
        id: camId,
        name: name.trim(),
        type: isDig ? "Digital" : "Analogue",
        defaultRollLength: isDig ? null : Number(rollLength),
        currentRollId: null,
        lensId: null,
        filterId: null,
      };
      let rolls = s.rolls;
      if (isDig) {
        const rollId = FB.uid("roll");
        rolls = [...rolls, {
          id: rollId, cameraId: camId, stockId: null, iso: null,
          length: 9999, startedAt: Date.now(), completedAt: null,
          shotCount: 0, digital: true,
        }];
        cam.currentRollId = rollId;
      }
      return { ...s, cameras: [...s.cameras, cam], rolls };
    });
    onDone && onDone(`Added ${name.trim()}`);
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Add camera" actionLabel="Add" onAction={handleAdd} actionDisabled={!canSubmit}>
      <div className="field">
        <label className="field-label">Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hasselblad 500C/M" autoFocus />
      </div>
      <div className="field">
        <label className="field-label">Kind</label>
        <div className="seg">
          <button className={`seg-opt ${kind === "analogue" ? "active" : ""}`} onClick={() => setKind("analogue")}>Analogue</button>
          <button className={`seg-opt ${kind === "digital" ? "active" : ""}`} onClick={() => setKind("digital")}>Digital</button>
        </div>
      </div>
      {kind === "analogue" && (
        <div className="field">
          <label className="field-label">Default roll length</label>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {["24","36","10","12","15","16"].map((n) => (
              <button key={n} className={`chip ${rollLength === n ? "selected" : ""}`} onClick={() => setRollLength(n)}>{n}</button>
            ))}
          </div>
          <input className="input mono" value={rollLength} onChange={(e) => setRollLength(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="36" />
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6 }}>Can be overridden each time you load a roll.</div>
        </div>
      )}
    </Sheet>
  );
}

// -------- Log a shot (aperture/shutter + optional note) --------
const APERTURES = ["f/1.2", "f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16", "f/22"];
const SHUTTERS = ["1s", "1/2", "1/4", "1/8", "1/15", "1/30", "1/60", "1/125", "1/250", "1/500", "1/1000", "B"];

function LogShotSheet({ state, setState, cameraId, open, onClose, onDone, existingShot, editFrame }) {
  const cam = FB.byId(state.cameras, cameraId);
  const roll = FB.rollForCamera(state, cameraId);
  const [aperture, setAperture] = useState("");
  const [shutter, setShutter] = useState("");
  const [note, setNote] = useState("");
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    if (open) {
      if (existingShot) {
        setAperture(existingShot.aperture || "");
        setShutter(existingShot.shutter || "");
        setNote(existingShot.note || "");
        setFrame(existingShot.frame);
      } else {
        setAperture("");
        setShutter("");
        setNote("");
        setFrame(editFrame || (roll ? roll.shotCount + 1 : 1));
      }
    }
  }, [open, existingShot, editFrame]);

  if (!cam || !roll) return null;

  const handleSave = () => {
    setState((s) => {
      let shots = s.shots;
      let rolls = s.rolls;
      if (existingShot) {
        shots = shots.map((sh) => sh.id === existingShot.id
          ? { ...sh, aperture: aperture || null, shutter: shutter || null, note: note.trim() || null }
          : sh);
      } else {
        const newShot = {
          id: FB.uid("s"),
          rollId: roll.id,
          frame,
          aperture: aperture || null,
          shutter: shutter || null,
          lensId: cam.lensId,
          filterId: cam.filterId,
          note: note.trim() || null,
          ts: Date.now(),
        };
        shots = [...shots, newShot];
        rolls = rolls.map((r) => r.id === roll.id ? { ...r, shotCount: Math.max(r.shotCount, frame) } : r);
      }
      return { ...s, shots, rolls };
    });
    onDone && onDone(existingShot ? "Shot updated" : `Frame #${frame} logged`);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={existingShot ? `Frame #${existingShot.frame}` : "Log this shot"} actionLabel="Save" onAction={handleSave}>
      {!existingShot && (
        <div className="field">
          <label className="field-label">Frame</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="icon-btn" onClick={() => setFrame((f) => Math.max(1, f - 1))} style={{ border: "1px solid var(--line)", width: 44, height: 44 }}>
              <Icon name="chevron-left" size={18} />
            </button>
            <div className="mono" style={{ fontSize: 28, fontWeight: 600, flex: 1, textAlign: "center" }}>#{frame}</div>
            <button className="icon-btn" onClick={() => setFrame((f) => f + 1)} style={{ border: "1px solid var(--line)", width: 44, height: 44 }}>
              <Icon name="chevron-right" size={18} />
            </button>
          </div>
        </div>
      )}
      <div className="as-grid">
        <div className="field" style={{ margin: 0 }}>
          <label className="field-label">Aperture</label>
          <SuggestInput value={aperture} onChange={setAperture} placeholder="f/8" suggestions={APERTURES} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label className="field-label">Shutter</label>
          <SuggestInput value={shutter} onChange={setShutter} placeholder="1/250" suggestions={SHUTTERS} />
        </div>
      </div>
      <div className="field" style={{ marginTop: 14 }}>
        <label className="field-label">Note (optional)</label>
        <textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything worth remembering about this shot…" />
      </div>
    </Sheet>
  );
}

// -------- Advance shot (bare) --------
function AdvanceShotSheet({ state, setState, cameraId, open, onClose, onDone }) {
  const cam = FB.byId(state.cameras, cameraId);
  const roll = FB.rollForCamera(state, cameraId);
  const nextFrame = roll ? roll.shotCount + 1 : 1;
  const handleAdvance = (withMeta) => {
    setState((s) => {
      const r = FB.byId(s.rolls, roll.id);
      const rolls = s.rolls.map((x) => x.id === r.id ? { ...x, shotCount: x.shotCount + 1 } : x);
      return { ...s, rolls };
    });
    onDone && onDone(`Advanced to frame #${nextFrame}`);
    onClose();
  };
  if (!cam || !roll) return null;
  return (
    <Sheet open={open} onClose={onClose} title="Advance frame">
      <div style={{ padding: "12px 0", textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 40, fontWeight: 600 }}>#{nextFrame}</div>
        <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>on {cam.name}, {roll.length === 9999 ? "digital" : `${nextFrame} of ${roll.length}`}</div>
      </div>
      <div className="stack" style={{ marginTop: 12 }}>
        <button className="btn-primary accent" onClick={() => handleAdvance(false)}>Just advance</button>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", textAlign: "center" }}>Use <em>Log shot</em> on the camera if you want to record aperture/shutter for this frame.</div>
      </div>
    </Sheet>
  );
}

// -------- Mark roll complete --------
function CompleteRollSheet({ state, setState, cameraId, open, onClose, onDone }) {
  const cam = FB.byId(state.cameras, cameraId);
  const roll = FB.rollForCamera(state, cameraId);
  if (!cam || !roll) return null;
  const stock = FB.byId(state.stocks, roll.stockId);
  const handleComplete = () => {
    setState((s) => {
      const rolls = s.rolls.map((r) => r.id === roll.id ? { ...r, completedAt: Date.now() } : r);
      const cameras = s.cameras.map((c) => c.id === cameraId ? { ...c, currentRollId: null } : c);
      return { ...s, rolls, cameras };
    });
    onDone && onDone("Roll marked complete");
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Mark roll complete">
      <div style={{ padding: "6px 0 14px", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
        Finish the <strong>{stock ? stock.name : "current"}</strong> roll on <strong>{cam.name}</strong>?
        <br />
        <span style={{ color: "var(--ink-3)", fontSize: 13 }}>
          Shot {roll.shotCount}{roll.length !== 9999 ? ` of ${roll.length}` : ""}. The roll and all its shots will be kept in history; the camera will be empty until you load a new roll.
        </span>
      </div>
      <button className="btn-primary" onClick={handleComplete}>Mark complete</button>
    </Sheet>
  );
}

// -------- Change shot number --------
function ChangeShotSheet({ state, setState, cameraId, open, onClose, onDone }) {
  const cam = FB.byId(state.cameras, cameraId);
  const roll = FB.rollForCamera(state, cameraId);
  const [n, setN] = useState("");
  useEffect(() => { if (open && roll) setN(String(roll.shotCount)); }, [open, roll]);
  if (!cam || !roll) return null;
  const handleSet = () => {
    const num = Math.max(0, parseInt(n || "0", 10));
    setState((s) => {
      const rolls = s.rolls.map((r) => r.id === roll.id ? { ...r, shotCount: num } : r);
      return { ...s, rolls };
    });
    onDone && onDone(`Shot count set to ${num}`);
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title="Change shot number" actionLabel="Save" onAction={handleSet}>
      <div className="field">
        <label className="field-label">Current frame on {cam.name}</label>
        <input className="input mono" value={n} onChange={(e) => setN(e.target.value.replace(/\D/g, ""))} inputMode="numeric" autoFocus style={{ fontSize: 24, textAlign: "center", padding: "16px" }} />
      </div>
    </Sheet>
  );
}

// -------- Backup / Restore --------
function BackupSheet({ state, setState, open, onClose, onDone }) {
  const [phase, setPhase] = useState("idle"); // idle | uploading | done
  useEffect(() => { if (open) setPhase("idle"); }, [open]);
  const handleBackup = () => {
    setPhase("uploading");
    setTimeout(() => {
      setState((s) => ({ ...s, lastBackupAt: Date.now() }));
      setPhase("done");
      setTimeout(() => {
        onDone && onDone("Backup complete");
        onClose();
      }, 900);
    }, 1200);
  };
  const [copied, setCopied] = useState(false);
  const copyKey = () => {
    navigator.clipboard && navigator.clipboard.writeText(state.backupKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <Sheet open={open} onClose={onClose} title="Backup to cloud">
      <div style={{ padding: "6px 0 10px" }}>
        <div style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 14 }}>
          Uploads all FilmBuddy data as JSON to your private S3 bucket, keyed by the identifier below. Keep this key safe — you’ll need it to restore on another device.
        </div>
        <div className="field-label">Backup key</div>
        <div className="key-box">
          <span>{state.backupKey}</span>
          <button className="icon-btn" onClick={copyKey} title="Copy">
            {copied ? <Icon name="check" size={16} /> : <Icon name="copy" size={16} />}
          </button>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 8 }}>
          Last backup: {state.lastBackupAt ? FB.relTime(state.lastBackupAt) : "never"}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        {phase === "idle" && (
          <button className="btn-primary accent" onClick={handleBackup}>
            <Icon name="upload" size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Back up now
          </button>
        )}
        {phase === "uploading" && (
          <button className="btn-primary accent" disabled>
            Uploading…
          </button>
        )}
        {phase === "done" && (
          <button className="btn-primary accent" disabled>
            <Icon name="check" size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Done
          </button>
        )}
      </div>
    </Sheet>
  );
}

function RestoreSheet({ state, setState, open, onClose, onDone }) {
  const [useOther, setUseOther] = useState(false);
  const [otherKey, setOtherKey] = useState("");
  const [phase, setPhase] = useState("idle");
  useEffect(() => { if (open) { setUseOther(false); setOtherKey(""); setPhase("idle"); } }, [open]);
  const handleRestore = () => {
    setPhase("restoring");
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => {
        onDone && onDone("Restore complete (simulated)");
        onClose();
      }, 900);
    }, 1400);
  };
  const keyToUse = useOther ? otherKey : state.backupKey;
  return (
    <Sheet open={open} onClose={onClose} title="Restore from cloud">
      <div style={{ padding: "6px 0 10px" }}>
        <div style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 14 }}>
          Replaces all local data with a prior backup.
        </div>
        <div className="seg" style={{ marginBottom: 12 }}>
          <button className={`seg-opt ${!useOther ? "active" : ""}`} onClick={() => setUseOther(false)}>This device’s key</button>
          <button className={`seg-opt ${useOther ? "active" : ""}`} onClick={() => setUseOther(true)}>Custom key</button>
        </div>
        {!useOther ? (
          <div className="key-box"><span>{state.backupKey}</span></div>
        ) : (
          <input className="input mono" value={otherKey} onChange={(e) => setOtherKey(e.target.value)} placeholder="fb-xxxx-xxxx-xxxx" />
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        {phase === "idle" && (
          <button className="btn-primary" onClick={handleRestore} disabled={useOther && !otherKey.trim()}>
            <Icon name="download" size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Restore
          </button>
        )}
        {phase === "restoring" && <button className="btn-primary" disabled>Fetching & restoring…</button>}
        {phase === "done" && (
          <button className="btn-primary" disabled>
            <Icon name="check" size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Restored
          </button>
        )}
      </div>
    </Sheet>
  );
}

Object.assign(window, {
  Sheet, SuggestInput,
  LoadFilmSheet, SwapLensFilterSheet, AddCameraSheet,
  LogShotSheet, AdvanceShotSheet, CompleteRollSheet,
  ChangeShotSheet, BackupSheet, RestoreSheet,
});


// ===== app/home.jsx =====
// Home screen — stacked camera cards + compact list variant
const { useState: useStateHome } = React;

function StaleBanner({ lastBackupAt, onBackupNow }) {
  const days = FB.daysSince(lastBackupAt);
  if (days <= 15) return null;
  return (
    <div className="stale" onClick={onBackupNow} role="button">
      <span className="dotpulse" />
      <span style={{ flex: 1 }}>
        It’s been <strong>{days} days</strong> since your last backup.
      </span>
      <span style={{ fontWeight: 600, fontSize: 13 }}>Back up →</span>
    </div>
  );
}

function CameraCardStacked({ state, camera, onOpen, onSwap, onLog, onMore, onLoadFilm, onSetCounter }) {
  const isDigital = /Digital/i.test(camera.type);
  const roll = FB.rollForCamera(state, camera.id);
  const lens = FB.byId(state.lenses, camera.lensId);
  const filter = FB.byId(state.filters, camera.filterId);
  const stock = roll ? FB.byId(state.stocks, roll.stockId) : null;
  const progress = roll && roll.length !== 9999 ? Math.min(100, (roll.shotCount / roll.length) * 100) : 0;

  return (
    <div className="card">
      <div className="card-top" onClick={onOpen} style={{ cursor: "pointer" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cam-name">{camera.name}</div>
          <div className="cam-sub">{camera.type}</div>
        </div>
        <div className="shot-counter">
          {roll ? (
            <>
              <div className="num mono">#{roll.shotCount}</div>
              <div className="of">{isDigital ? "frame" : `of ${roll.length}`}</div>
            </>
          ) : (
            <div className="of" style={{ marginTop: 4 }}>no roll</div>
          )}
        </div>
      </div>

      {isDigital ? (
        <div className="film-row" style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onSetCounter && onSetCounter(camera.id); }}>
          <div>
            <span className="film-main">In-camera counter</span>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>Tap to match your camera's display</div>
          </div>
          <div className="active-chip" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
            <Icon name="more" size={12} /> Set
          </div>
        </div>
      ) : roll ? (
        <>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="film-row">
            <div>
              <span className="film-main">{stock ? stock.name : "Unknown stock"}</span>
            </div>
            <div className="film-iso mono">ISO {roll.iso}</div>
          </div>
        </>
      ) : (
        <div className="film-row" style={{ cursor: "pointer" }} onClick={onLoadFilm}>
          <div className="cam-empty-state">No film loaded</div>
          <div className="active-chip" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
            <Icon name="plus-sm" size={12} /> Load film
          </div>
        </div>
      )}

      <div className="pills">
        <span className={`pill ${lens ? "accent" : "ghost"}`}>
          <Icon name="lens" size={12} />
          {lens ? lens.name : "no lens recorded"}
        </span>
        {filter ? (
          <span className="pill">
            <Icon name="filter" size={12} />
            {filter.name}
          </span>
        ) : (
          <span className="pill ghost">no filter</span>
        )}
      </div>

      <div className="card-actions">
        <button className="act-btn primary" onClick={onSwap}>
          <Icon name="swap" size={18} />
          Swap lens/filter
        </button>
        <button className="act-btn" onClick={onLog} disabled={!roll} style={{ opacity: roll ? 1 : 0.4 }}>
          <Icon name="film-frame" size={18} />
          Log shot
        </button>
        <button className="act-btn" onClick={onMore}>
          <Icon name="more" size={18} />
          More
        </button>
      </div>
    </div>
  );
}

function CameraRowCompact({ state, camera, onOpen }) {
  const roll = FB.rollForCamera(state, camera.id);
  const lens = FB.byId(state.lenses, camera.lensId);
  const filter = FB.byId(state.filters, camera.filterId);
  const stock = roll ? FB.byId(state.stocks, roll.stockId) : null;
  return (
    <div className="list-row" onClick={onOpen}>
      <div className="left" style={{ minWidth: 0, flex: 1 }}>
        <div className="cam-name">{camera.name}</div>
        <div className="cam-sub" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {stock ? `${stock.name} · ISO ${roll.iso}` : "No roll"}{lens ? ` · ${lens.name}` : ""}{filter ? ` + ${filter.name}` : ""}
        </div>
      </div>
      <div className="right">
        {roll ? (
          <>
            <div className="num mono">#{roll.shotCount}</div>
            <div className="of mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
              {roll.length === 9999 ? "digital" : `/ ${roll.length}`}
            </div>
          </>
        ) : (
          <div className="of" style={{ fontSize: 12, color: "var(--ink-3)" }}>—</div>
        )}
      </div>
    </div>
  );
}

// "More" action sheet
function MoreActionsSheet({ state, cameraId, open, onClose, onChoose }) {
  const cam = cameraId ? FB.byId(state.cameras, cameraId) : null;
  const roll = cam ? FB.rollForCamera(state, cam.id) : null;
  if (!cam) return null;
  const isDigital = /Digital/i.test(cam.type);
  const opts = [
    { id: "load", label: "Load new roll", sub: roll ? "Replaces the current roll" : "No film currently loaded", show: !isDigital },
    { id: "change-shot", label: isDigital ? "Set in-camera counter" : "Change shot number", sub: isDigital ? "Match your camera's frame number" : "Correct a miscount", show: !!roll },
    { id: "complete", label: "Mark roll complete", sub: "Keep in history, empty the camera", show: !!roll && !isDigital },
    { id: "log", label: "Log aperture/shutter for current frame", sub: `Frame #${roll ? roll.shotCount : "—"}`, show: !!roll },
  ].filter((o) => o.show);
  return (
    <Sheet open={open} onClose={onClose} title={cam.name}>
      <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginBottom: 4 }}>Choose an action</div>
      {opts.map((o) => (
        <div key={o.id} className="opt-row" onClick={() => onChoose(o.id)}>
          <div className="ll">
            <div className="t">{o.label}</div>
            <div className="s">{o.sub}</div>
          </div>
          <Icon name="chevron-right" size={18} style={{ color: "var(--ink-3)" }} />
        </div>
      ))}
    </Sheet>
  );
}

function Home({ state, setState, tweaks, onOpenCamera, onAdd, onSwap, onLog, onMore, onLoadFilm, onBackup, onRestore }) {
  const isCompact = tweaks.homeLayout === "list";
  return (
    <div className="page" data-screen-label="01 Home">
      <div className="app-header">
        <div>
          <div className="brand">FilmBuddy<span className="dot">.</span></div>
          <div className="header-sub">{state.cameras.length} cameras · {state.rolls.filter(r => !r.completedAt).length} active rolls</div>
        </div>
      </div>

      <StaleBanner lastBackupAt={state.lastBackupAt} onBackupNow={onBackup} />

      <div className="section-label">
        <span>Your cameras</span>
        <span className="count mono">{state.cameras.length}</span>
      </div>

      {isCompact ? (
        <div className="cards" style={{ gap: 6 }}>
          {state.cameras.map((cam) => (
            <CameraRowCompact key={cam.id} state={state} camera={cam} onOpen={() => onOpenCamera(cam.id)} />
          ))}
          <button className="add-card" onClick={onAdd} style={{ marginTop: 4 }}>
            <Icon name="plus" size={16} /> Add camera
          </button>
        </div>
      ) : (
        <div className="cards">
          {state.cameras.map((cam) => (
            <CameraCardStacked
              key={cam.id}
              state={state}
              camera={cam}
              onOpen={() => onOpenCamera(cam.id)}
              onSwap={() => onSwap(cam.id)}
              onLog={() => onLog(cam.id)}
              onMore={() => onMore(cam.id)}
              onLoadFilm={() => onLoadFilm(cam.id)}
            />
          ))}
          <button className="add-card" onClick={onAdd}>
            <Icon name="plus" size={16} /> Add camera
          </button>
        </div>
      )}

      <div className="footer">
        <div className="footer-head">
          <div className="footer-title">Backup</div>
          {FB.daysSince(state.lastBackupAt) > 15 ? (
            <div className="footer-meta stale">
              <Icon name="alert" size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} />
              {FB.daysSince(state.lastBackupAt)} days ago
            </div>
          ) : (
            <div className="footer-meta">Last: {FB.relTime(state.lastBackupAt)}</div>
          )}
        </div>
        <div className="footer-btns">
          <button className="btn-ghost" onClick={onBackup}>
            <Icon name="upload" size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} /> Backup
          </button>
          <button className="btn-ghost" onClick={onRestore}>
            <Icon name="download" size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} /> Restore
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Home, MoreActionsSheet });


// ===== app/roll.jsx =====
// Camera detail — shot strip + details

function Frame({ shot, frame, isCurrent, isEmpty, onClick }) {
  const exposure = shot && (shot.aperture || shot.shutter)
    ? `${shot.aperture || "—"}\n${shot.shutter || "—"}`
    : "";
  return (
    <div className={`frame ${isCurrent ? "current" : ""} ${isEmpty ? "empty" : ""}`} onClick={onClick}>
      <div className="fn mono">#{frame}</div>
      <div className="exposure mono">{exposure.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>
      <div className={shot && (shot.note || shot.aperture || shot.shutter) ? "has-meta" : "no-meta"} />
    </div>
  );
}

function CameraDetail({ state, setState, cameraId, onBack, onSwap, onLog, onLogFrame, onMore, onLoadFilm }) {
  const cam = FB.byId(state.cameras, cameraId);
  if (!cam) return null;
  const isDigital = /Digital/i.test(cam.type);
  const roll = FB.rollForCamera(state, cam.id);
  const stock = roll ? FB.byId(state.stocks, roll.stockId) : null;
  const lens = FB.byId(state.lenses, cam.lensId);
  const filter = FB.byId(state.filters, cam.filterId);
  const shots = roll ? FB.shotsForRoll(state, roll.id) : [];

  // Build frames — include every frame up to max(shotCount, length); mark logged
  const maxFrame = roll ? (roll.length === 9999 ? Math.max(roll.shotCount, 20) : roll.length) : 0;
  const currentFrame = roll ? roll.shotCount : 0;
  const frames = [];
  if (roll) {
    for (let i = 1; i <= maxFrame; i++) {
      const shot = shots.find((s) => s.frame === i);
      frames.push({ frame: i, shot });
    }
  }

  return (
    <div className="page" data-screen-label={`02 ${cam.name}`}>
      <button className="nav-back" onClick={onBack}>
        <Icon name="chevron-left" size={18} /> Cameras
      </button>
      <div className="detail-header">
        <h1>{cam.name}</h1>
        <div className="sub">{cam.type}</div>
      </div>

      <div style={{ padding: `0 var(--pad)` }}>
        {roll ? (
          <>
            <div className="card" style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{isDigital ? "In-camera counter" : (stock ? stock.name : "—")}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
                    {isDigital ? "Match this to your camera's frame counter" : <>ISO <span className="mono">{roll.iso}</span> · started {FB.relTime(roll.startedAt)}</>}
                  </div>
                </div>
                <div className="shot-counter">
                  <div className="num mono">#{roll.shotCount}</div>
                  <div className="of">{isDigital ? "frame" : `of ${roll.length}`}</div>
                </div>
              </div>
              {!isDigital && (
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${Math.min(100, (roll.shotCount / roll.length) * 100)}%` }} />
                </div>
              )}
            </div>

            <div className="section-label" style={{ padding: "18px 0 0" }}>
              <span>Timeline</span>
              <span className="count mono">{shots.length} logged</span>
            </div>
            <div className="timeline">
              {frames.map(({ frame, shot }) => (
                <Frame
                  key={frame}
                  frame={frame}
                  shot={shot}
                  isCurrent={frame === currentFrame}
                  isEmpty={frame > currentFrame}
                  onClick={() => onLogFrame(cam.id, frame, shot)}
                />
              ))}
            </div>

            <div className="section-label" style={{ padding: "18px 0 0" }}>
              <span>Current setup</span>
            </div>
            <div className="card" style={{ padding: "4px 14px" }}>
              <dl className="detail-grid" style={{ borderTop: 0 }}>
                <dt>Lens</dt>
                <dd>{lens ? lens.name : <span style={{ color: "var(--ink-3)" }}>—</span>}</dd>
                <dt>Filter</dt>
                <dd>{filter ? filter.name : <span style={{ color: "var(--ink-3)" }}>None</span>}</dd>
                {!isDigital && <><dt>Stock</dt>
                <dd>{stock ? stock.name : "—"}</dd>
                <dt>Shooting ISO</dt>
                <dd className="mono">{roll.iso}</dd></>}
              </dl>
            </div>

            {shots.length > 0 && (
              <>
                <div className="section-label" style={{ padding: "18px 0 0" }}>
                  <span>Logged shots</span>
                </div>
                <div className="cards" style={{ padding: 0, gap: 8 }}>
                  {shots.slice().reverse().map((s) => {
                    const sLens = FB.byId(state.lenses, s.lensId);
                    const sFilter = FB.byId(state.filters, s.filterId);
                    return (
                      <div key={s.id} className="card" style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => onLogFrame(cam.id, s.frame, s)}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <div className="mono" style={{ fontSize: 17, fontWeight: 600 }}>#{s.frame}</div>
                          <div className="mono" style={{ fontSize: 13, color: "var(--ink-2)" }}>
                            {s.aperture || "—"} · {s.shutter || "—"}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
                          {sLens ? sLens.name : "lens —"}{sFilter ? ` + ${sFilter.name}` : ""}
                        </div>
                        {s.note && <div className="shot-note">{s.note}</div>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="card" style={{ marginTop: 10, padding: 22, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No film loaded</div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 14 }}>Load a roll to start tracking shots.</div>
            <button className="btn-primary accent" onClick={() => onLoadFilm(cam.id)}>
              <Icon name="film" size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Load film
            </button>
          </div>
        )}

        <div style={{ height: 12 }} />
        <div className="card-actions" style={{ borderTop: 0, marginTop: 14 }}>
          <button className="act-btn primary" onClick={() => onSwap(cam.id)}>
            <Icon name="swap" size={18} />
            Swap lens
          </button>
          <button className="act-btn" onClick={() => onLog(cam.id)} disabled={!roll} style={{ opacity: roll ? 1 : 0.4 }}>
            <Icon name="film-frame" size={18} />
            Log shot
          </button>
          <button className="act-btn" onClick={() => onMore(cam.id)}>
            <Icon name="more" size={18} />
            More
          </button>
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

Object.assign(window, { CameraDetail });


// ===== app/tweaks.jsx =====
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


// ===== app/app.jsx =====
// Root app — orchestrates screens, sheets, tweaks, toast
const { useState: useS, useEffect: useE, useMemo: useM } = React;

function App() {
  const [state, setState] = useS(() => FB.loadState());
  const [tweaks, setTweaks] = useS(() => FB.loadTweaks());
  const [screen, setScreen] = useS(() => {
    try {
      const s = localStorage.getItem("filmbuddy.screen");
      return s ? JSON.parse(s) : { name: "home" };
    } catch { return { name: "home" }; }
  });
  const [sheet, setSheet] = useS({ kind: null, cameraId: null, extra: null });
  const [toast, setToast] = useS(null);
  const [tweaksOpen, setTweaksOpen] = useS(false);
  const [tweaksEnabled, setTweaksEnabled] = useS(false);

  useE(() => { FB.saveState(state); }, [state]);
  useE(() => { FB.saveTweaks(tweaks); }, [tweaks]);
  useE(() => { try { localStorage.setItem("filmbuddy.screen", JSON.stringify(screen)); } catch {} }, [screen]);

  // Apply tweaks to DOM
  useE(() => {
    document.documentElement.style.setProperty("--accent-h", String(tweaks.accentHue));
    document.documentElement.dataset.theme = tweaks.theme;
    document.documentElement.dataset.density = tweaks.density;
  }, [tweaks]);

  // Tweaks parent-frame integration
  useE(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksEnabled(true);
      if (e.data.type === "__deactivate_edit_mode") { setTweaksEnabled(false); setTweaksOpen(false); }
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Persist tweaks back to host
  useE(() => {
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: tweaks }, "*");
  }, [tweaks]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(null), 2000);
  };

  const openSheet = (kind, cameraId = null, extra = null) => setSheet({ kind, cameraId, extra });
  const closeSheet = () => setSheet({ kind: null, cameraId: null, extra: null });

  const handleMoreChoose = (action) => {
    const camId = sheet.cameraId;
    closeSheet();
    setTimeout(() => {
      if (action === "load") openSheet("load", camId);
      else if (action === "change-shot") openSheet("change-shot", camId);
      else if (action === "complete") openSheet("complete", camId);
      else if (action === "log") openSheet("log", camId);
    }, 280);
  };

  const go = (s) => setScreen(s);

  const isHome = screen.name === "home";

  return (
    <div className="stage">
      <div className="app">
        {isHome ? (
          <Home
            state={state}
            setState={setState}
            tweaks={tweaks}
            onOpenCamera={(id) => go({ name: "camera", cameraId: id })}
            onAdd={() => openSheet("add-camera")}
            onSwap={(id) => openSheet("swap", id)}
            onLog={(id) => openSheet("log", id)}
            onMore={(id) => openSheet("more", id)}
            onLoadFilm={(id) => openSheet("load", id)}
            onSetCounter={(id) => openSheet("change-shot", id)}
            onBackup={() => openSheet("backup")}
            onRestore={() => openSheet("restore")}
          />
        ) : (
          <CameraDetail
            state={state}
            setState={setState}
            cameraId={screen.cameraId}
            onBack={() => go({ name: "home" })}
            onSwap={(id) => openSheet("swap", id)}
            onLog={(id) => openSheet("log", id)}
            onLogFrame={(id, frame, existing) => openSheet("log", id, { editFrame: frame, existingShot: existing })}
            onMore={(id) => openSheet("more", id)}
            onLoadFilm={(id) => openSheet("load", id)}
          />
        )}

        <LoadFilmSheet state={state} setState={setState} cameraId={sheet.cameraId} open={sheet.kind === "load"} onClose={closeSheet} onDone={showToast} />
        <SwapLensFilterSheet state={state} setState={setState} cameraId={sheet.cameraId} open={sheet.kind === "swap"} onClose={closeSheet} onDone={showToast} />
        <AddCameraSheet state={state} setState={setState} open={sheet.kind === "add-camera"} onClose={closeSheet} onDone={showToast} />
        <LogShotSheet
          state={state} setState={setState} cameraId={sheet.cameraId}
          open={sheet.kind === "log"}
          onClose={closeSheet} onDone={showToast}
          existingShot={sheet.extra ? sheet.extra.existingShot : null}
          editFrame={sheet.extra ? sheet.extra.editFrame : null}
        />
        <CompleteRollSheet state={state} setState={setState} cameraId={sheet.cameraId} open={sheet.kind === "complete"} onClose={closeSheet} onDone={showToast} />
        <ChangeShotSheet state={state} setState={setState} cameraId={sheet.cameraId} open={sheet.kind === "change-shot"} onClose={closeSheet} onDone={showToast} />
        <MoreActionsSheet state={state} cameraId={sheet.cameraId} open={sheet.kind === "more"} onClose={closeSheet} onChoose={handleMoreChoose} />
        <BackupSheet state={state} setState={setState} open={sheet.kind === "backup"} onClose={closeSheet} onDone={showToast} />
        <RestoreSheet state={state} setState={setState} open={sheet.kind === "restore"} onClose={closeSheet} onDone={showToast} />

        {toast && <div className={`toast show`}>{toast}</div>}

        {tweaksEnabled && (
          <>
            <button className="tweaks-fab" onClick={() => setTweaksOpen((o) => !o)} title="Tweaks">
              <Icon name="sliders" size={18} />
            </button>
            <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksOpen} onClose={() => setTweaksOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

