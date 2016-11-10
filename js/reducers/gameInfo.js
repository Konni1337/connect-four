import * as ActionTypes from "../constants/ActionTypes";

const defaultState = {
  isRunning: false
};


export default function game(state = {}, action) {
  switch (action.type) {
    case ActionTypes.START_GAME:
    case ActionTypes.START_TRAINING:
      return Object.assign({}, state, {isRunning: true});
    case ActionTypes.END_GAME:
      return Object.assign({}, state, {isRunning: false});
    default:
      return state;
  }
}