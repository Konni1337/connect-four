import Root from "./Root";

/**
 * A game AI that uses Monte Carlo Tree Search to find the best move
 */
export default class MonteCarloTreeSearch {
  constructor(id, maxDepth = 1000) {
    this.id = id;
    this.maxDepth = maxDepth;
  }

  clone() {
    return new MonteCarloTreeSearch(this.id, this.maxMilliseconds)
  }

  /**
   * Finds the best action by MCTS
   *
   * @param game    instance of the game
   * @param cb      callback
   */
  selectAction(game, cb) {
    cb(this.selectActionSync(game))
  }

  /**
   * Finds the best action by MCTS
   *
   * @param game    instance of the game
   */
  selectActionSync(game) {
    return new Root(game).exploreAndFind(this.maxDepth);
  }

  /**
   * A hook that is called when a game is finished
   */
  endGame(result, callback) {
    callback();
  }

  /**
   * Returns false
   *
   * @returns {boolean}
   */
  isHuman() {
    return false;
  }
}
