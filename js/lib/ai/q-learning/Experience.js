import 'whatwg-fetch';
import StateActionValue from "./StateActionValue";
import StateAction from "./StateAction";

export default class Experience {
  id = null;

  constructor(id) {
    this.id = id;
  }

  set(stateAction, value, callback) {
    fetch('/q-learning/set/', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        stateAction: stateAction,
        value: value
      })
    }).then((response) => {
      if (response.status !== 200) throw 'could not save data';
      if (callback) callback();
    }).catch((err) => {
      console.log('parsing failed', err);
      if (callback) callback(err);
    })
  }


  get(stateAction, callback) {
    fetch('/q-learning/get/', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        stateAction: stateAction
      })
    }).then((response) => response.json()).then((json) => {
      let parsedJson = JSON.parse(json);
      callback(null, parsedJson.value);
    }).catch((err) => {
      console.log('parsing failed', err);
      callback(err)
    })
  }

  bestStateActionValue(state, possibleActions, callback) {
    fetch('/q-learning/best', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        stateActions: possibleActions.map(action => new StateAction(state, action))
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