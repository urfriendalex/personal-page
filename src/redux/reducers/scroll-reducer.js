import { SET_SCROLL } from '../types'

const initState = {
    scrollInstanse: {}
}

export default function (state = initState, action)
{
    switch (action.type)
    {
        case SET_SCROLL:
            return {
                ...state,
                scrollInstanse: action.payload
            };
        default:
            return state;
    }
}