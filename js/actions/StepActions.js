import * as ActionTypes from "../constants/ActionTypes";

export function changeMenuStep(step) {
  return {type: ActionTypes.CHANGE_MENU_STEP, step}
}

export function changeGameFormStep(step) {
  return {type: ActionTypes.CHANGE_GAME_FORM_STEP, step}
}

export function changePlayerFormStep(step) {
  return {type: ActionTypes.CHANGE_PLAYER_FORM_STEP, step}
}

export function changeTrainingsFormStep(step) {
  return {type: ActionTypes.CHANGE_TRAININGS_FORM_STEP, step}
}

export function reset() {
  return {type: ActionTypes.RESET}
}