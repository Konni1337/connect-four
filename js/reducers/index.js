import {combineReducers} from "redux";
import {MAKE_MOVE, END_GAME, START_GAME} from "../constants/gameActionTypes";
import Game from "../lib/Game";
import QLearning from "../lib/ai/q-learning/QLearning";
import {TOGGLE_IS_TRAINING} from "../constants/gameActionTypes";
import {SET_TRAINING_ITERATIONS} from "../constants/gameActionTypes";

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

function players(state = {}, action) {
  switch (action.type) {
    case END_GAME:
      state.player1 && state.player1.endGame(action.result);
      state.player2 && state.player2.endGame(action.result);
      return {};
    case START_GAME:
      return {player1: action.player1, player2: action.player2};
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

function trainingIterations(state = 0, action) {
  switch (action.type) {
    case SET_TRAINING_ITERATIONS:
      return action.trainingIterations;
    default:
      return state;
  }
}

function isTraining(state = false, action) {
  switch (action.type) {
    case TOGGLE_IS_TRAINING:
      return action.isTraining;
    default:
      return state;
  }
}


export default combineReducers({
  game,
  players,
  statistics,
  isStarted,
  isTraining,
  trainingIterations
}) 