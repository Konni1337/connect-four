import * as ActionTypes from "../constants/ActionTypes";

const defaultState = {
  columns: 7,
  rows: 7
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