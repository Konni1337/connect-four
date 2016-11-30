import Node from './Node';
import '../../../extensions/arrayExtensions';
import {getRandomElement} from "../../../helpers/CommonHelper";

/**
 * The root node of the tree for MCTS. It is a special kind of Node, it has no action
 */
export default class Root extends Node {
  constructor(game) {
    super(game, null, null);
  }

  /**
   * This start a simulation to explore the possible actions and estimate there UTC wins
   *
   * @returns {Object} action
   */
  exploreAndFind(maxDepth) {
    for (let i = 0; i < maxDepth; i++) this._findNodeToExplore().finishRandom();
    return this._bestAction();
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
   * Returns the best action
   *
   * @returns {number, number}
   */
  _bestAction() {
    let children = this.children;
    let highest = [children[0]];
    for (let i = 1, len = children.length; i < len; i++) {
      let child = children[i];
      if (child.value() === highest[0].value()) highest.push(child);
      if (child.value() > highest[0].value()) highest = [child];
    }
    return getRandomElement(highest).action;
  }

  /**
   * @private
   * Finds the a node that should be explored depending on the utc value.
   *
   * @param {Node} node
   * @returns {Node}
   */
  _findNodeToExplore(node = this) {
    while (!(node.hasActionsLeft() || node.isLeaf())) node = node.utcChild();
    return node.isLeaf() ? node : node.expand();
  }
}
