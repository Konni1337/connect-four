import 'whatwg-fetch';
import dbLayer from '../db/dbLayer';
import winston from "winston";
import stateToKeyString from "../db/stateToKeyString";

var INITIAL_QVALUE = 0.0;


/**
 * This class is an interface to get and set the experience for the qLearning AI
 */
export default class Experience {
  id = null;
  db = null;

  constructor(id) {
    this.id = id;
    this.db = dbLayer.getDatabase(id);
  }

  /**
   * Sets the state action value on the server
   *
   * @param stateAction
   * @param value
   * @param callback
   */
  setValue(stateAction, value, callback) {
    let key = stateToKeyString(stateAction);
    if (stateAction && !isNaN(value)) {
      this.db.put(key, value, callback)
    } else {
      throw 'invalid data'
    }
  }

  /**
   * Gets a state action value from the server
   *
   * @param stateAction
   * @param callback
   */
  getValue(stateAction, callback) {
    this.db.get(stateToKeyString(stateAction), function (err, value) {
      let newValue = err || isNaN(value) ? INITIAL_QVALUE : value;
      callback(null, newValue);
    });
  }

  /**
   * Finds the best value of an array of state actions
   *
   * @param state
   * @param possibleActions
   * @param callback
   */
  bestStateActionValue(state, possibleActions, callback) {
    const stateActions = possibleActions.map(action => {
      return {state, action}
    });
    if (stateActions && stateActions.length > 0) {
      this.getAll(stateActions, function (stateActionValues) {
        let best = null;

        stateActionValues.forEach(function (stateActionValue) {
          if (!best || best.value < stateActionValue.value) best = stateActionValue
        });
        callback(null, best);
      });
    }
  }


  getAll(stateActions = [], callback) {
    let self = this;

    function _getAll(stateActions, stateActionValues, callback) {
      if (stateActions.length === 0) {
        return callback(stateActionValues);
      }
      let stateAction = stateActions.pop();
      self.getValue(stateAction, function (ignore, value) {
        stateActionValues.push({stateAction: stateAction, value: value});
        _getAll(stateActions, stateActionValues, callback)
      })
    }

    _getAll(stateActions, [], callback)
  }


}