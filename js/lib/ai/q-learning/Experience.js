import 'whatwg-fetch';
import StateAction from "./StateAction";
import dbLayer from '../db/dbLayer';

var INITIAL_QVALUE = 0.5;


function stateForPlayer(grid, playerId) {
  const stateArray = [];
  for (let y = grid[0].length - 1; y >= 0; y--) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[x][y] === playerId) stateArray.push(x + 1);
    }
  }
  return stateArray;
}

function stateActionToString(stateAction) {
  let grid = stateAction.state; // 2D grid array
  const player1State = stateForPlayer(grid, 1);
  const player2State = stateForPlayer(grid, 2);
  let stateString = player1State.reduce(function (stateString, value, index) {
    if (player2State.length === index) {
      return stateString + value;
    } else {
      return stateString + value + player2State[index];
    }
  }, '');
  return stateString + '.' + stateAction.action.index;
}

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
    if (stateAction && !isNaN(value)) {
      this.db.put(stateActionToString(stateAction), value, callback)
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
    this.db.get(stateActionToString(stateAction), function (err, value) {
      let newValue = err || !value ? INITIAL_QVALUE : value;
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
    const stateActions = possibleActions.map(action => new StateAction(state, action));
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