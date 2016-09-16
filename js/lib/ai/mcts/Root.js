import Node from './Node';
import {DRAW} from "../../../constants/GameFixtures";

/**
 * Finds the closest child that has unexplored moves
 * @param {Node} node
 * @returns {Node}
 */
function selectNodeToExplore(node) {
  if (node.isLeaf() || !node.noMovesLeft()) return node;
  return selectNodeToExplore(node.bestChild());
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
   * @returns {number, number}
   */
  bestMove() {
    return this.bestChild().move;
  }

  /**
   * This start a simulation to explore the possible moves and estimate there UTC value
   */
  exploreTree(maxTime) {
    // TODO maybe fix number not time?
    while (new Date().getTime() < maxTime) {
      let node = selectNodeToExplore(this);
      let playNode = node.isLeaf() ? node : node.expand();
      playNode.update(playNode.playRandom());
    }
  }

  exploreAndFind(maxMilliseconds) {
    this.exploreTree(new Date().getTime() + maxMilliseconds);
    return this.bestMove();
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