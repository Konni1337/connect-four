import * as ActionTypes from "../constants/gameActionTypes";
import {GAME_TYPE_TRAINING, HUMAN} from "../constants/GameFixtures";


export function changeGameType(gameType) {
  return {type: ActionTypes.CHANGE_GAME_TYPE, gameType}
}

export function changeTrainingIterations(trainingIterations) {
  return {type: ActionTypes.CHANGE_TRAINING_ITERATIONS, trainingIterations}
}

export function makeMove(move) {
  return dispatch => {
    dispatch({type: ActionTypes.START_REQUEST});
    return fetch('/move', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(move)
    }).then(response => response.json())
      .then(json => {
        json = JSON.parse(json);
        dispatch({type: ActionTypes.UPDATE_GAME, game: json.game, statistics: json.statistics});
        dispatch({type: ActionTypes.END_REQUEST});
      })
      .catch(error => {
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_REQUEST});
      });
  }
}

export function startGame(gameInfo) {
  return dispatch => {
    dispatch({type: ActionTypes.START_REQUEST});
    if (gameInfo.gameType === GAME_TYPE_TRAINING) {
      return fetch('/training', {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(gameInfo)
      }).then(response => response.json())
        .then(json => {
          json = JSON.parse(json);
          dispatch({type: ActionTypes.TRAINING_START, trainingsId: json.trainingsId, statistics: json.statistics});
          dispatch({type: ActionTypes.END_REQUEST});
        })
        .catch(error => {
          console.error(error);
          dispatch({type: ActionTypes.REQUEST_ERROR, error});
          dispatch({type: ActionTypes.END_REQUEST});
        })
    } else {
      let onlyAi = gameInfo.player1.algorithm !== HUMAN && gameInfo.player2.algorithm !== HUMAN;
      dispatch({type: ActionTypes.CHANGE_ONLY_AI, onlyAi: onlyAi});
      return fetch('/game', {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(gameInfo)
      }).then(response => response.json())
        .then(json => {
          json = JSON.parse(json);
          dispatch({type: ActionTypes.UPDATE_GAME, game: json.game, statistics: json.statistics});
          dispatch({type: ActionTypes.END_REQUEST});
        })
        .catch(error => {
          console.error(error);
          dispatch({type: ActionTypes.REQUEST_ERROR, error});
          dispatch({type: ActionTypes.END_REQUEST});
        });
    }
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
        dispatch({type: ActionTypes.UPDATE_TRAINING, isFinished: json.isFinished, statistics: json.statistics, trainingsId: json.trainingsId});
        dispatch({type: ActionTypes.END_REQUEST});
      })
      .catch(error => {
        console.error(error);
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_REQUEST});
      });
  }
}

export function endTraining() {
  return {type: ActionTypes.TRAINING_END}
}

export function reset() {
  return {type: ActionTypes.RESET}
}
