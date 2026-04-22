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
