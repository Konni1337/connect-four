import {getRandomElement} from "../../../helpers/CommonHelper";
import {BEST_FIRST_ACTION} from "../../../constants/config";
import stateToString from "../../dbLayer/stateToKeyString";
/**
 * Human player class
 */
export default class Random {
  id = null;

  constructor(id) {
    this.id = id;
  }

  clone() {
    return new Random(this.id)
  }

  /**
   * Finds the best action by MCTS
   *
   * @param game    instance of the game
   * @param callback
   */
  selectAction(game, callback) {
    if (BEST_FIRST_ACTION && parseInt(stateToString(game.grid)) === 0 && game.grid.length === 7) {
      return callback({index: 3, player: this.id});
    }
    return callback(getRandomElement(game.getValidActions()));
  }

  /**
   * Returns false
   *
   * @returns {boolean}
   */
  isHuman() {
    return false;
  }

  /**
   * A hook that is called when a game is finished
   */
  endGame(result, callback) {
    callback();
  }
}
