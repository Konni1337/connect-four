import {combineReducers} from "redux";
import {MAKE_MOVE, END_GAME, START_GAME} from "../constants/gameActionTypes";
import Game from "../lib/Game";

function game(state = new Game(), action) {
  switch (action.type) {
    case MAKE_MOVE:
      return action.game;
    case END_GAME:
    case START_GAME:
      return new Game();
    default:
      return state;
  }
}

function players(state = [], action) {
  if (action.type === START_GAME) {
    return action.players;
  } else {
    return state;
  }
}

function values(state = [], action) {
  switch (action.type) {
    case MAKE_MOVE:
      return action.values;
    case END_GAME:
    case START_GAME:
      return [];
    default:
      return state;
  }
}

let defaultStatistics = {
  draw: 0,
  1: 0,
  2: 0
};

function statistics(state = defaultStatistics, action) {
  switch (action.type) {
    case END_GAME:
      let newState = Object.assign({}, state);
      newState[action.result]++;
      return newState;
    default:
      return state;
  }
}

function isStarted(state = false, action) {
  switch (action.type) {
    case START_GAME:
      return true;
    case END_GAME:
      return false;
    default:
      return state;
  }
}


export default combineReducers({
  game,
  players,
  values,
  statistics,
  isStarted
}) 