import { SWITCH_BG_VERSION, SWITCH_THEME_MODE } from "../types";

const BG_SWITCH_COOLDOWN_MS = 1100;
const BG_VERSION_STORAGE_KEY = "selectedBgVersion";

const getStoredBgVersion = () => {
  if (typeof window === "undefined") return 1;

  const rawValue = window.localStorage.getItem(BG_VERSION_STORAGE_KEY);
  const parsedValue = Number.parseInt(rawValue ?? "", 10);

  return [1, 2, 3].includes(parsedValue) ? parsedValue : 1;
};

const persistBgVersion = (bgVersion) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BG_VERSION_STORAGE_KEY, String(bgVersion));
};

const initState = {
  bgVersion: getStoredBgVersion(),
  isLight: false,
  lastBgSwitchAt: 0,
};

export default function themeReducer(state = initState, action) {
  switch (action.type) {
    case SWITCH_BG_VERSION: {
      const requestedAt = action.payload?.requestedAt ?? Date.now();
      const isLocked = requestedAt - state.lastBgSwitchAt < BG_SWITCH_COOLDOWN_MS;
      if (isLocked) return state;

      const nextBgVersion = state.bgVersion === 3 ? 1 : state.bgVersion + 1;
      persistBgVersion(nextBgVersion);

      return {
        ...state,
        bgVersion: nextBgVersion,
        lastBgSwitchAt: requestedAt,
      };
    }
    case SWITCH_THEME_MODE:
      return {
        ...state,
        isLight: !state.isLight,
      };
    default:
      return state;
  }
}
