import Node from './Node';
import '../../../extensions/arrayExtensions';
import {getRandomElement} from "../../../helpers/CommonHelper";

/**
 * The root node of the tree for MCTS. It is a special kind of Node, it has no move
 */
export default class Root extends Node {
  constructor(game) {
    super(game, null, null);
  }

  /**
   * This start a simulation to explore the possible moves and estimate there UTC wins
   *
   * @returns {Object} move
   */
  exploreAndFind(maxDepth) {
    for (let i = 0; i < maxDepth; i++) this._findNodeToExplore().finishRandom();
    return this._bestMove();
  }

  /**
   * Updates the statistics for this node by the given result
   * @param result
   */
  update(result) {
    this.visits += 1;
  }

  /**
   * @private
   * Returns the best move
   *
   * @returns {number, number}
   */
  _bestMove() {
    let children = this.children;
    let highest = [children[0]];
    for (let i = 1, len = children.length; i < len; i++) {
      let child = children[i];
      if (child.value() === highest[0].value()) highest.push(child);
      if (child.value() > highest[0].value()) highest = [child];
    }
    return getRandomElement(highest).move;
  }

  /**
   * @private
   * Finds the a node that should be explored depending on the utc value.
   *
   * @param {Node} node
   * @returns {Node}
   */
  _findNodeToExplore(node = this) {
    while (!(node.hasMovesLeft() || node.isLeaf())) node = node.utcChild();
    return node.isLeaf() ? node : node.expand();
  }
}
