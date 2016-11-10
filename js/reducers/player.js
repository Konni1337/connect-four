import* as ActionTypes from "../constants/ActionTypes";
import {Q_LEARNING} from "../constants/GameFixtures";

const defaultState = {
  player1: {
    algorithm: Q_LEARNING
  },
  player2: {
    algorithm: Q_LEARNING
  }
};

export default function player(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_PLAYER:
      if (action.index === 1) {
        return Object.assign({}, state, {player1: action.player});
      } else {
        return Object.assign({}, state, {player2: action.player});
      }
    default:
      return state;
  }
}