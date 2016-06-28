import Node from './Node';

function selectNodeToExplore(self) {
  let node = self;
  let goOn = true;
  while (goOn) {
    if (node.isLeaf() || !node.noMovesLeft()) {
      goOn = false
    } else {
      node = node.bestChild();
    }
  }
  return node;
}

export default class Root extends Node {
  constructor(game) {
    super(game, null, null);
  }
  
  isRoot() {
    return true;
  }

  bestMove() {
    return this.bestChild().move;
  }

  // Simulation
  exploreTree() {
    let node = selectNodeToExplore(this);
    let playNode = node.isLeaf() ? node : node.expand();
    playNode.update(playNode.playRandom());
  }

  update(result) {
    result === this.currentPlayer ?  this.won() : this.lost();
  }
}