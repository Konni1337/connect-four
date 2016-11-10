import* as ActionTypes from "../constants/ActionTypes";

const defaultState = {
  menu: 1,
  gameForm: 1,
  playerForm: 1,
  trainingsForm: 1
};

export default function steps(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_MENU_STEP:
      return Object.assign({}, state, {menu: action.step});
    case ActionTypes.CHANGE_GAME_FORM_STEP:
      return Object.assign({}, state, {gameForm: action.step});
    case ActionTypes.CHANGE_PLAYER_FORM_STEP:
      return Object.assign({}, state, {playerForm: action.step});
    case ActionTypes.CHANGE_TRAININGS_FORM_STEP:
      return Object.assign({}, state, {trainingsForm: action.step});
    default:
      return state;
  }
}