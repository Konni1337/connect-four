import * as ActionTypes from "../constants/ActionTypes";

export function fetchDatabases() {
  return dispatch => {
    dispatch({type: ActionTypes.START_FETCHING_DATABASES});
    return fetch('/statistics', {
      method: 'GET',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    }).then(response => response.json())
      .then(json => {
        dispatch({type: ActionTypes.SET_STATISTICS_DATABASES, databases: json.databases});
        dispatch({type: ActionTypes.END_FETCHING_DATABASES});
      })
      .catch(error => {
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_FETCHING_DATABASES});
      });
  }
}

export function fetchData(name) {
  return dispatch => {
    dispatch({type: ActionTypes.START_FETCHING_DATA});
    return fetch('/statistics/' + name, {
      method: 'GET',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    }).then(response => response.json())
      .then(json => {
        dispatch({type: ActionTypes.SET_STATISTICS_DATA, data: json.data});
        dispatch({type: ActionTypes.END_FETCHING_DATABASES});
      })
      .catch(error => {
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_FETCHING_DATA});
      });
  }
}

