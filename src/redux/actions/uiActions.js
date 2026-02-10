import { SWITCH_BG_VERSION, SWITCH_THEME_MODE } from "../types";

export const switchBgVersion = () => ({
  type: SWITCH_BG_VERSION,
  payload: { requestedAt: Date.now() },
});

export const switchThemeMode = () => ({ type: SWITCH_THEME_MODE });



