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
