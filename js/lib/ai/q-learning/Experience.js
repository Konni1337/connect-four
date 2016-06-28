import 'whatwg-fetch';
import StateActionValue from "./StateActionValue";
import StateAction from "./StateAction";

function _bestStateActionValue(state, possibleActions, stateActionValues, get, callback) {
  if (possibleActions.length === 0) {
    callback(null, stateActionValues);
    return
  }
  let stateAction = new StateAction(state, possibleActions.pop());
  if (!stateAction) debugger;
  get(stateAction, (err, value) => {
    if (err) callback(err);
    stateActionValues.push(new StateActionValue(stateAction, value));
    _bestStateActionValue(state, possibleActions, stateActionValues, get, callback)
  })
}

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
    if (!stateAction) debugger;
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

  bestStateActionValue(state, possibleActions, isBetter, callback) {
    let possibleActionsClone = JSON.parse(JSON.stringify(possibleActions));
    _bestStateActionValue(state, possibleActionsClone, [], this.get, (err, stateActionValues) => {
      if (err) callback(err);
      let best = stateActionValues.reduce((stateActionValue, best) => {
        return isBetter(stateActionValue.value, best.value) ? stateActionValue : best
      }, stateActionValues[0]);
      callback(null, best)
    })
  }
}