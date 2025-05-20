import { SET_SCROLL } from "../types";

const initState = {
  scrollInstance: {},
};

export default function scrollReducer(state = initState, action) {
  switch (action.type) {
    case SET_SCROLL:
      return {
        ...state,
        scrollInstance: action.payload,
      };
    default:
      return state;
  }
}
