import {combineReducers} from "redux";
import* as ActionTypes from "../constants/ActionTypes";
import grid from './grid';
import steps from './steps';
import player from './player';
import gameInfo from './gameInfo';
import game from './game';
import scores from './scores';
import training from './training';
import statistics from './statistics';

function isLoading(state = false, action) {
  switch (action.type) {
    case ActionTypes.START_REQUEST:
      return true;
    case ActionTypes.END_REQUEST:
      return false;
    default:
      return state
  }
}

function error(state = {}, action) {
  switch (action.type) {
    case ActionTypes.CLOSE_ERROR:
      return {};
    case ActionTypes.ERROR:
      return action.error;
    default:
      return state
  }
}

const appReducer = combineReducers({
  game,
  gameInfo,
  error,
  player,
  grid,
  steps,
  isLoading,
  scores,
  training,
  statistics
});

const rootReducer = (state, action) => {
  if (action.type === ActionTypes.RESET) {
    state = undefined
  }

  return appReducer(state, action)
};

export default rootReducer;
