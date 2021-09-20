import { SWITCH_BG_VERSION, SWITCH_THEME_MODE } from '../types'

const initState = {
    bgVersion: '1',
    isLight: false
}

export default function (state = initState, action)
{
    switch (action.type)
    {
        case SWITCH_BG_VERSION:
            if (state.bgVersion === '1')
            {
                return {
                    ...state,
                    bgVersion: '2'
                };
            } else if (state.bgVersion === '2')
            {
                return {
                    ...state,
                    bgVersion: '3'
                };
            } else if (state.bgVersion === '3')
            {
                return {
                    ...state,
                    bgVersion: '1'
                };
            }
            break;
        case SWITCH_THEME_MODE:
            return {
                ...state,
                isLight: !state.isLight
            }
        default:
            return state;
    }

}