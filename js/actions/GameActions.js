import * as ActionTypes from "../constants/ActionTypes";
require('es6-promise').polyfill();
import 'whatwg-fetch';


export function makeAction(action) {
  return dispatch => {
    dispatch({type: ActionTypes.START_REQUEST});
    return fetch('/action', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(action)
    }).then(response => response.json())
      .then(json => {
        json = JSON.parse(json);
        dispatch({type: ActionTypes.UPDATE_GAME, game: json.game, scores: json.scores});
        dispatch({type: ActionTypes.END_REQUEST});
      })
      .catch(error => {
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_REQUEST});
      });
  }
}

export function startGame(grid, player1, player2) {
  return dispatch => {
    dispatch({type: ActionTypes.START_REQUEST});
    return fetch('/new-game', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({grid, player1, player2})
    }).then(response => response.json())
      .then(json => {
        json = JSON.parse(json);
        dispatch({type: ActionTypes.UPDATE_GAME, game: json.game});
        dispatch({type: ActionTypes.UPDATE_SCORE_BOARD, scores: json.scores});
        dispatch({type: ActionTypes.END_REQUEST});
        dispatch({type: ActionTypes.START_GAME});
      })
      .catch(error => {
        console.error(error);
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_REQUEST});
      });
  }
}

export function showStatistics() {
  return {}
}
