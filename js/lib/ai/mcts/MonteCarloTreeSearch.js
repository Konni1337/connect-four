import {Root} from "./Root";
export default class MonteCarloTreeSearch {
  constructor(game, exploreCount = 5000) {
    this.game = game;
    this.exploreCount = exploreCount;
    this.root = new Root(game);
  }

  findBestMove() {
    for (let i = 0; i < this.exploreCount; i++) {
      this.root.exploreTree()
    }
    return this.root.bestMove();
  }

  values() {
    return this.root.children.map(child => child.value()).reverse()
  }


}