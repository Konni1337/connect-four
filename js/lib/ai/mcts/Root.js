import Node from './Node';
import {DRAW} from "../../../constants/GameFixtures";
import '../../../utils/arrayExtensions'

/**
 * Finds the closest child that has unexplored moves
 * @param {Node} node
 * @returns {Array}
 */
function selectNodeToExplore(node) {
  let visitedNotes = [node];
  while (!node.hasMovesLeft() && !node.isLeaf()) {
    node = node.utcChild();
    visitedNotes.push(node)
  }
  return visitedNotes;
}

/**
 * The root node of the tree for MCTS. It is a special kind of Node, it has no move
 */
export default class Root extends Node {
  constructor(game) {
    super(game, null);
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
   * This start a simulation to explore the possible moves and estimate there UTC summedValue
   */
  exploreAndFind(maxDepth) {
    for (let i = 0; i < maxDepth; i++) {
      let visitedNotes = selectNodeToExplore(this);
      let node = visitedNotes.last();
      let playNode = node.isLeaf() ? node : node.expand();
      let result = playNode.playRandom();
      playNode.update(result);
      for (let i = visitedNotes.length; i > 0; i--) {
        result = result !== DRAW ? result === 1 ? 2 : 1 : DRAW;
        visitedNotes[i - 1].update(result);
      }
    }
    return this.bestMove();
  }

  bestChild() {
    let children = this.children;
    let highest = children[0];
    for (let i = 1, len = children.length; i < len; i++) {
      let child = children[i];
      if (child.value() > highest.value()) highest = child;
    }
    return highest;
  }

  /**
   * Updates the statistics for this node by the given result
   * @param result
   */
  update(result) {
    if (result === this.game.currentPlayer) {
      this.lost();
    } else if (result === DRAW) {
      this.draw();
    } else {
      this.won();
    }
  }
}
