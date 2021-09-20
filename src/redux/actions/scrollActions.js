import
{
    SET_SCROLL
} from '../types';

export const setScrollInstanse = (instanse) => (dispatch) =>
{
    dispatch({ type: SET_SCROLL, payload: instanse })
};