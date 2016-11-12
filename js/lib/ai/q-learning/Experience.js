import 'whatwg-fetch';
import winston from '../../logger/QLearningLogger';
import {stateActionString} from "../../db/stateToKeyString";
import {PERSIST, INITIAL_QVALUE, STATISTICS_DB_PREFIX} from "../../../constants/config";
import {getRandomElement} from "../../../helpers/CommonHelper";
import dbLayer from "../../db/dbLayer";

/**
 * This class is an interface to get and set the experience for the qLearning AI
 */
export default class Experience {
  id = 'default';
  db = null;
  persist = false;

  constructor(id) {
    if (id.startsWith(STATISTICS_DB_PREFIX)) throw 'agent id cant start with ' + STATISTICS_DB_PREFIX;
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
    if (!this.persist) return callback();
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
   * Sets the QValue for the given key
   *
   * @param key
   * @param value
   * @param callback
   */
  setQValue(key, value, callback) {
    this.set(key, value, (err) => {
      if (err) {
        winston.error(err);
        throw err;
      }
      callback();
    });
  }

  /**
   * Returns the QValue for the given key
   *
   * @param key
   * @param callback
   */
  getQValue(key, callback) {
    this.get(key, function (err, value) {
      if (err) winston.error(err);
      callback(parseFloat(err || isNaN(value) ? INITIAL_QVALUE : value));
    });
  }

  /**
   * Finds the best state action value
   *
   * @param state
   * @param possibleActions
   * @param callback
   */
  bestStateActionValue(state, possibleActions, callback) {
    this._bestStateActionValue(state, possibleActions.slice(0), [], callback);
  }

  /**
   * private helper for recursion
   *
   * @param state
   * @param actions
   * @param bestStateActionValues
   * @param callback
   * @returns {*}
   * @private
   */
  _bestStateActionValue(state, actions, bestStateActionValues = [], callback) {
    let self = this;

    if (actions.length === 0) return callback(getRandomElement(bestStateActionValues));

    let action = actions.pop();
    self.getQValue(stateActionString(state, action), value => {
      let newBest = [{state, action, value}];
      if (bestStateActionValues.length > 0) {
        let best = bestStateActionValues[0].value;
        if (best > value) newBest = bestStateActionValues;
        if (best === value) newBest.push(...bestStateActionValues)
      }
      self._bestStateActionValue(state, actions, newBest, callback)
    });
  }


}
