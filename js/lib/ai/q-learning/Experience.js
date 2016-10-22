import 'whatwg-fetch';
import winston from '../../logger/QLearningLogger';
import stateToKeyString from "../dbLayer/stateToKeyString";
import {PERSIST, INITIAL_QVALUE} from "../../../constants/config";
import {getRandomElement} from "../../../helpers/CommonHelper";
import dbLayer from "../dbLayer/dbLayer";
import level from 'level-party';
import StateAction from "./StateAction";

/**
 * This class is an interface to get and set the experience for the qLearning AI
 */
export default class Experience {
  id = 'default';
  db = null;
  persist = false;
  constructor(id) {
    this.id = id;
    this.db = dbLayer.getDatabase(id);
    this.persist = process.env.NODE_ENV !== 'test' && PERSIST;
  }

  /**
   * Sets a value for a given key on the database
   *
   * @param key
   * @param value
   * @param callback
   */
  set(key, value, callback) {
    this.db.put(key, value, callback);
  }

  /**
   * Gets a value for a given key on the database
   *
   * @param key
   * @param callback
   */
  get(key, callback) {
    this.db.get(key, callback);
  }

  /**
   * Sets the state action summedValue on the server
   *
   * @param stateAction
   * @param value
   * @param callback
   */
  setValue(stateAction, value, callback) {
    let self = this;
    let stringState = stateToKeyString(stateAction);
    if (stateAction && !isNaN(value)) {
      if (this.persist) {
        this.db.put(stringState, value, (err) => {
          if (err) {
            winston.error(err);
            throw err;
          }
          callback();
        });
      } else {
        callback();
      }
    } else {
      // console.error(stateAction, value)
      winston.error(self.id + ' got invalid input data. METHOD: setValue; ARGS: ' + JSON.stringify(arguments, null, 2));
      throw 'invalid data'
    }
  }

  /**
   * Gets a state action summedValue from the server
   *
   * @param stateAction
   * @param callback
   */
  getValue(stateAction, callback) {
    let stringState = stateToKeyString(stateAction);
    this.db.get(stringState, function (err, value) {
      if (err) winston.error(err);
      let newValue = parseFloat(err || isNaN(value) ? INITIAL_QVALUE : value);
      callback(newValue);
    });
  }

  /**
   * Finds the best summedValue of an array of state actions
   *
   * @param state
   * @param possibleActions
   * @param callback
   */
  bestStateActionValue(state, possibleActions, callback) {
    let stateActions = possibleActions.map(action => {
      return new StateAction(state, action);
    });
    if (stateActions && stateActions.length > 0) {
      this.getAll(stateActions, stateActionValues => {
        let best = [];
        stateActionValues.forEach(stateActionValue => {
          if (best.length === 0 || best[0].value === stateActionValue.value) {
            best.push(stateActionValue)
          } else if (best[0].value < stateActionValue.value) {
            best = [stateActionValue];
          }
        });
        callback(getRandomElement(best));
      });
    } else {
      winston.error(this.id + ' never should be able to get here. METHOD: bestStateActionValue; ARGS: ' + JSON.stringify(arguments, null, 2));
      throw "shouldn't be able get here"
    }
  }


  getAll(stateActions = [], callback) {
    let self = this;

    function _getAll(stateActions, stateActionValues, callback) {
      if (stateActions.length === 0) {
        return callback(stateActionValues);
      }
      let stateAction = stateActions.pop();
      self.getValue(stateAction, value => {
        stateActionValues.push({stateAction: stateAction, value: value});
        _getAll(stateActions, stateActionValues, callback)
      })
    }

    _getAll(stateActions, [], callback)
  }


}
