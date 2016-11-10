import * as ActionTypes from "../constants/ActionTypes";

const defaultState = {iterations: 1000000, isFinished: false};

export default function training(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_TRAININGS_ITERATIONS:
      return Object.assign({}, state, {iterations: action.iterations});
    case ActionTypes.START_TRAINING:
      return Object.assign({}, state, {trainingsId: action.trainingsId});
    case ActionTypes.UPDATE_TRAINING:
      return Object.assign({}, state, {isFinished: action.isFinished});
    default:
      return state;
  }
}
