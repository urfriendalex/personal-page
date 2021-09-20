import
{
    LOADING_UI, SWITCH_BG_VERSION, SWITCH_THEME_MODE
} from '../types';

export const loadingUI = () => (dispatch) =>
{
    dispatch({ type: LOADING_UI })
};

export const switchBgVersion = () => (dispatch) =>
{
    dispatch({ type: SWITCH_BG_VERSION })
};

export const switchThemeMode = () => (dispatch) =>
{
    dispatch({ type: SWITCH_THEME_MODE })
};