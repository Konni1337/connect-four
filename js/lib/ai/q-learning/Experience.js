import 'whatwg-fetch';
import StateActionValue from "./StateActionValue";
import StateAction from "./StateAction";

/**
 * This class is an interface to get and set the experience for the qLearning AI
 */
export default class Experience {
  id = null;

  constructor(id) {
    this.id = id;
  }

  /**
   * Sets the state action value on the server
   *
   * @param stateAction
   * @param value
   * @param callback
   */
  set(stateAction, value, callback) {
    fetch('/q-learning/set/', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        stateAction: stateAction,
        value: value,
        id: this.id
      })
    }).then((response) => {
      if (response.status !== 200) throw 'could not save data';
      if (callback) callback();
    }).catch((err) => {
      console.log('parsing failed', err);
      if (callback) callback(err);
    })
  }

  /**
   * Gets a state action value from the server
   *
   * @param stateAction
   * @param callback
   */
  get(stateAction, callback) {
    fetch('/q-learning/get/', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        stateAction: stateAction,
        id: this.id
      })
    }).then((response) => response.json()).then((json) => {
      let parsedJson = JSON.parse(json);
      callback(null, parsedJson.value);
    }).catch((err) => {
      console.log('parsing failed', err);
      callback(err)
    })
  }

  /**
   * Finds the best value of an array of state actions
   * 
   * @param state
   * @param possibleActions
   * @param callback
   */
  bestStateActionValue(state, possibleActions, callback) {
    fetch('/q-learning/best', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        stateActions: possibleActions.map(action => new StateAction(state, action)),
        id: this.id
      })
    }).then((response) => response.json()).then((json) => {
      let parsedJson = JSON.parse(json);
      callback(null, parsedJson.bestStateActionValue);
    }).catch((err) => {
      console.log('parsing failed', err);
      callback(err)
    })
  }
}