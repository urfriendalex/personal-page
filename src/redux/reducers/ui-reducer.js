import { SWITCH_BG_VERSION, SWITCH_THEME_MODE } from "../types";

const BG_SWITCH_COOLDOWN_MS = 1100;

const initState = {
  bgVersion: 1,
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
