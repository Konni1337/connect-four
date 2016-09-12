import {getRandomElement} from "../../../helpers/commonHelper";
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
    return callback(getRandomElement(game.getValidMoves()));
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
  endGame() {}
}