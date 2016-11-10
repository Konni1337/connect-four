import * as ActionTypes from "../constants/ActionTypes";

const defaultState = {}

export default function game(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_GAME:
      return action.game;
    default:
      return state;
  }
}
