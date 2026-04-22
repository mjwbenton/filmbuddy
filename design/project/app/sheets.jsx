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
