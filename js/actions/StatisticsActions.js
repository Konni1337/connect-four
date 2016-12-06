import * as ActionTypes from "../constants/ActionTypes";
import {STATISTICS_DB_PREFIX} from "../constants/config";

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

export function fetchData(database) {
  return dispatch => {
    dispatch({type: ActionTypes.START_FETCHING_DATA});
    return fetch('/statistics/' + database, {
      method: 'GET',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    }).then(response => response.json())
      .then(json => {
        dispatch({type: ActionTypes.SET_STATISTICS_DATA, data: json.data, database});
        dispatch({type: ActionTypes.END_FETCHING_DATABASES});
      })
      .catch(error => {
        console.error(error);
        dispatch({type: ActionTypes.REQUEST_ERROR, error});
        dispatch({type: ActionTypes.END_FETCHING_DATA});
      });
  }
}

export function addDatabase(database) {
  return {type: ActionTypes.ADD_DATABASE, database}
}

export function removeDatabase(database) {
  return {type: ActionTypes.REMOVE_DATABASE, database}
}

export function markDatabase(database) {
  return {type: ActionTypes.MARK_DATABASE, database}
}

export function mergeData(name, databases, data) {
  name = [STATISTICS_DB_PREFIX, name].join('-');
  const mergeData = data.filter(database => databases.indexOf(database.database) >= 0);
  const filteredData = data.filter(database => databases.indexOf(database.database) < 0);
  const shortest = mergeData.reduce((shortest, current) => {
    if (!shortest) return current;
    return shortest.data.length > current.data.length ? current : shortest;
  });
  const mergedData = shortest.data.map((valuePair, index) => {
    let values = mergeData.map(database => database.data[index]);
    let sumValue = values.reduce((sumValue, currentPair) => {
      return sumValue + currentPair[1];
    }, 0);
    return [valuePair[0], (sumValue / values.length)];
  });

  return {
    type: ActionTypes.MERGE_DATABASE,
    data: [{database: name, data: mergedData}, ...filteredData],
    markedDatabases: [],
    newDatabase: name,
    databases
  }
}

