import* as ActionTypes from "../constants/ActionTypes";

const defaultState = {
  databases: null,
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
      return Object.assign({}, state, {data: action.data});
    default:
      return state;
  }
}