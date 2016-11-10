import * as ActionTypes from "../constants/ActionTypes";

export function changeIterations(event) {
  return {type: ActionTypes.CHANGE_TRAININGS_ITERATIONS, iterations: parseInt(event.target.value)}
}

export function startTraining(iterations, grid, player1, player2) {
  return dispatch => {
    return fetch('/training', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({iterations, grid, player1, player2})
    }).then(response => response.json())
      .then(json => {
        json = JSON.parse(json);
        dispatch({type: ActionTypes.START_TRAINING, trainingsId: json.trainingsId});
        dispatch({type: ActionTypes.UPDATE_SCORE_BOARD, scores: json.scores});
        dispatch({type: ActionTypes.END_REQUEST});
        checkUpdateLoop(dispatch, json.trainingsId);
      })
      .catch(error => {
        console.error(error);
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_REQUEST});
      })
  }
}

export function updateTraining(trainingsId) {
  return dispatch => {
    dispatch({type: ActionTypes.START_REQUEST});
    return fetch('/statistics', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({trainingsId})
    }).then(response => response.json())
      .then(json => {
        json = JSON.parse(json);
        dispatch({type: ActionTypes.UPDATE_TRAINING, isFinished: json.isFinished});
        dispatch({type: ActionTypes.UPDATE_SCORE_BOARD, scores: json.scores});
        dispatch({type: ActionTypes.END_REQUEST});
      })
      .catch(error => {
        console.error(error);
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_REQUEST});
      });
  }
}

function checkUpdateLoop(dispatch, trainingsId) {
  setTimeout(function () {
    dispatch({type: ActionTypes.START_REQUEST});
    fetch('/scores', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({trainingsId})
    }).then(response => response.json())
      .then(json => {
        json = JSON.parse(json);
        dispatch({type: ActionTypes.UPDATE_TRAINING, isFinished: json.isFinished});
        dispatch({type: ActionTypes.UPDATE_SCORE_BOARD, scores: json.scores});
        dispatch({type: ActionTypes.END_REQUEST});
        if (!json.isFinished) checkUpdateLoop(dispatch, trainingsId);
      })
      .catch(error => {
        console.error(error);
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_REQUEST});
      });
  }, 1000);
}
