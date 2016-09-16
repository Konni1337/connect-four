import Root from "./Root";

/**
 * A game AI that uses Monte Carlo Tree Search to find the best move
 */
export default class MonteCarloTreeSearch {
  constructor(id, maxMilliseconds = 50) {
    this.id = id;
    this.maxMilliseconds = maxMilliseconds;
  }

  clone() {
    return new MonteCarloTreeSearch(this.id, this.maxMilliseconds)
  }

  /**
   * Finds the best action by MCTS
   *
   * @param game    instance of the game
   * @param callback
   */
  selectAction(game, callback) {
    this.bestAction = new Root(game).exploreAndFind(this.maxMilliseconds);
    return callback(this.bestAction);
  }

  /**
   * Returns the values for each child
   * Currently unused but usefull for debugging
   *
   * @returns {Array.<Number>}
   */
  values() {
    return this.values;
  }

  /**
   * A hook that is called when a game is finished
   */
  endGame() {}

  /**
   * Returns false
   * 
   * @returns {boolean}
   */
  isHuman() {
    return false;
  }
}