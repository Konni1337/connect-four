import Root from "./Root";

/**
 * A game AI that uses Monte Carlo Tree Search to find the best move
 */
export default class MonteCarloTreeSearch {
  constructor(id, exploreCount = 1000) {
    this.id = id;
    this.exploreCount = exploreCount;
  }

  /**
   * Finds the best action by MCTS
   * 
   * @param game    instance of the game
   * @param callback
   */
  selectAction(game, callback) {
    let root = new Root(game);
    for (let i = 0; i < this.exploreCount; i++) {
      root.exploreTree();
    }
    this.values = root.children.map(child => child.value()).reverse();
    callback(root.bestMove());
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