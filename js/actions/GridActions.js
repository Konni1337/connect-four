import * as ActionTypes from "../constants/ActionTypes";

export function changeColumns(event) {
  return {type: ActionTypes.CHANGE_GRID_COLUMNS, columns: parseInt(event.target.value)}
}

export function changeRows(event) {
  return {type: ActionTypes.CHANGE_GRID_ROWS, rows: parseInt(event.target.value)}
}