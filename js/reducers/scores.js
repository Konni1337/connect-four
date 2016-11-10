import * as ActionTypes from "../constants/ActionTypes";

const defaultState = {draw: 0, 1: 0, 2: 0};

export default function scores(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SCORE_BOARD:
      return action.scores;
    default:
      return state;
  }
}
