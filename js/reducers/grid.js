import * as ActionTypes from "../constants/ActionTypes";
import {GRID_HEIGHT, GRID_LENGTH} from "../constants/GameFixtures";

const defaultState = {
  columns: GRID_LENGTH,
  rows: GRID_HEIGHT
};

export default function grid(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_GRID_COLUMNS:
      return Object.assign({}, state, {columns: action.columns});
    case ActionTypes.CHANGE_GRID_ROWS:
      return Object.assign({}, state, {rows: action.rows});
    default:
      return state;
  }
}
