import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';

export default function configureStore(initialState) {
  if (true) {
    return createStore(rootReducer, initialState, compose(
      applyMiddleware(thunkMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  } else {
    return createStore(rootReducer, initialState, compose(
      applyMiddleware(thunkMiddleware)
    ));
  }
}
