import {combineReducers} from "redux";
import* as ActionTypes from "../constants/gameActionTypes";
import {GAME_TYPE_NONE} from "../constants/GameFixtures";

function game(state = {}, action) {
  switch (action.type) {
    case ActionTypes.MAKE_MOVE:
    case ActionTypes.UPDATE_GAME:
      return action.game;
    case ActionTypes.GAME_END:
      return {};
    default:
      return state;
  }
}

function training(state = {}, action) {
  switch (action.type) {
    case ActionTypes.TRAINING_START:
      return {trainingsId: action.trainingsId, isFinished: false};
    case ActionTypes.UPDATE_TRAINING:
      return {trainingsId: action.trainingsId, isFinished: action.isFinished};
    default:
      return state;
  }
}

function statistics(state = {}, action) {
  switch (action.type) {
    case ActionTypes.TRAINING_START:
    case ActionTypes.UPDATE_GAME:
    case ActionTypes.UPDATE_TRAINING:
      return action.statistics;
    case ActionTypes.UPDATE_STATISTICS:
      return action.statistics;
    default:
      return state;
  }
}

function isStarted(state = false, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_GAME:
      return !action.game.isFinished;
    case ActionTypes.TRAINING_START:
      return true;
    case ActionTypes.TRAINING_END:
      return false;
    default:
      return state;
  }
}

function trainingIterations(state = 10, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_TRAINING_ITERATIONS:
      return action.trainingIterations;
    default:
      return state;
  }
}

function gameType(state = GAME_TYPE_NONE, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_GAME:
      if (action.game.isFinished) return GAME_TYPE_NONE;
      return state;
    case ActionTypes.CHANGE_GAME_TYPE:
      return action.gameType;
    default:
      return state;
  }
}

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

function onlyAi(state = false, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_ONLY_AI:
      return action.onlyAi;
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
  error,
  statistics,
  isStarted,
  isLoading,
  gameType,
  trainingIterations,
  training,
  onlyAi
});

const rootReducer = (state, action) => {
  if (action.type === ActionTypes.RESET) {
    state = undefined
  }

  return appReducer(state, action)
};

export default rootReducer;
