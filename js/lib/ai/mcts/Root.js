import Node from './Node';
import {DRAW} from "../../../constants/GameFixtures";
import '../../../extensions/arrayExtensions';

/**
 * The root node of the tree for MCTS. It is a special kind of Node, it has no move
 */
export default class Root extends Node {
  constructor(game) {
    super(game, null, null);
  }

  /**
   * Returns the best move
   *
   * @returns {number, number}
   */
  bestMove() {
    let children = this.children;
    let highest = children[0];
    for (let i = 1, len = children.length; i < len; i++) {
      let child = children[i];
      if (child.value() > highest.value()) highest = child;
    }
    return highest.move;
  }

  /**
   * Finds the a node that should be explored depending on the utc value.
   * @param {Node} node
   * @returns {Node}
   */
  findNodeToExplore(node = this) {
    while (!(node.hasMovesLeft() || node.isLeaf())) node = node.utcChild();
    return node.isLeaf() ? node : node.expand();
  }

  /**
   * This start a simulation to explore the possible moves and estimate there UTC wins
   *
   * @returns {Object} move
   */
  exploreAndFind(maxDepth) {
    for (let i = 0; i < maxDepth; i++) this.findNodeToExplore().finishRandom();
    return this.bestMove();
  }

  /**
   * Updates the statistics for this node by the given result
   * @param result
   */
  update(result) {
    if (result === this.game.currentPlayer) {
      this.won();
    } else if (result === DRAW) {
      this.draw();
    } else {
      this.lost();
    }
  }
}
