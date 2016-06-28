import Root from "./Root";
export default class MonteCarloTreeSearch {
  constructor(id, game, exploreCount = 5000) {
    this.id = id;
    this.exploreCount = exploreCount;
  }

  selectAction(game, callback) {
    let root = new Root(game);
    for (let i = 0; i < this.exploreCount; i++) {
      root.exploreTree()
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

  endGame() {}

  isHuman() {
    return false;
  }
}