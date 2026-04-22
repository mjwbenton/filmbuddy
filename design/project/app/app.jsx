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
