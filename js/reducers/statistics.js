import* as ActionTypes from "../constants/ActionTypes";

const defaultState = {
  databases: null,
  selectedDatabases: [],
  markedDatabases: [],
  data: null,
  isFetching: false
};

export default function statistics(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.START_FETCHING_DATABASES:
    case ActionTypes.START_FETCHING_DATA:
      return Object.assign({}, state, {isFetching: true});
    case ActionTypes.END_FETCHING_DATABASES:
    case ActionTypes.END_FETCHING_DATA:
      return Object.assign({}, state, {isFetching: false});
    case ActionTypes.SET_STATISTICS_DATABASES:
      return Object.assign({}, state, {databases: action.databases});
    case ActionTypes.SET_STATISTICS_DATA:
      if (state.data) {
        return Object.assign({}, state, {data: [{data: action.data, database: action.database}, ...state.data]});
      } else {
        return Object.assign({}, state, {data: [{data: action.data, database: action.database}]});
      }
    case ActionTypes.ADD_DATABASE:
      return Object.assign({}, state, {
        selectedDatabases: [action.database, ...state.selectedDatabases],
        databases: state.databases.filter(database => database !== action.database)
      });
    case ActionTypes.REMOVE_DATABASE:
      return Object.assign({}, state, {
        databases: [action.database, ...state.databases],
        data: state.data.filter(data => data.database !== action.database),
        selectedDatabases: state.selectedDatabases.filter(database => database !== action.database)
      });
    case ActionTypes.MARK_DATABASE:
      if (state.markedDatabases.indexOf(action.database) >= 0) {
        return Object.assign({}, state, {
          markedDatabases: state.markedDatabases.filter(database => database !== action.database)
        });
      } else {
        return Object.assign({}, state, {markedDatabases: [action.database, ...state.markedDatabases]});
      }
    case ActionTypes.MERGE_DATABASE:
      const selectedDatabases = [action.newDatabase, ...state.selectedDatabases]
        .filter(database => !action.databases.includes(database));
      return Object.assign({}, state, {
        data: action.data,
        databases: [...action.databases, ...state.databases],
        markedDatabases: action.markedDatabases,
        selectedDatabases
      });
    default:
      return state;
  }
}
