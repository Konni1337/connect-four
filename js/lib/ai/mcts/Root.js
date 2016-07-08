import Node from './Node';
import {DRAW} from "../../../constants/GameFixtures";

/**
 * Finds the closest child that has unexplored moves
 * @param {Node} node
 * @returns {Node}
 */
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

/**
 * The root node of the tree for MCTS. It is a special kind of Node, it has no parent and no move
 */
export default class Root extends Node {
  constructor(game) {
    super(game, null, null);
  }

  /**
   * Returns true
   *
   * @returns {boolean}
   */
  isRoot() {
    return true;
  }

  /**
   * Returns the best move
   *
   * @returns {Move}
   */
  bestMove() {
    return this.bestChild().move;
  }

  /**
   * This start a simulation to explore the possible moves and estimate there UTC value
   */
  exploreTree() {
    let node = selectNodeToExplore(this);
    let playNode = node.isLeaf() ? node : node.expand();
    playNode.update(playNode.playRandom());
  }

  /**
   * Updates the statistics for this node by the given result
   * @param result
   */
  update(result) {
    if (result === this.currentPlayer) {
      this.won();
    } else if (result === DRAW) {
      this.draw();
    } else {
      this.lost();
    }
  }
}