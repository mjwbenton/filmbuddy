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
