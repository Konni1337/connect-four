import RandomMCTS from "./RandomMCTS";
import {DRAW} from "../../../constants/GameFixtures";

export default class Node {
  constructor(game, move, parent) {
    this.game = game;
    this.move = move;
    this.parent = parent;
    this.wins = 0;
    this.visits = 0;
    this.children = [];
    this.unvisitedMoves = game.getValidMoves();
  }

  clone() {
    let move = this.move && JSON.parse(JSON.stringify(this.move));
    let node = new Node(this.game.clone(), move);
    node.parent = this.parent && this.parent.clone();
    node.wins = this.wins;
    node.visits = this.visits;
    node.children = this.children.map(child => child.clone());
    node.unvisitedMoves = this.unvisitedMoves.slice();
    return node;
  }

  /**
   * Returns true if this node is a leaf in the Monte Carlo Tree, else false.
   *
   * @returns {boolean|*}
   */
  isLeaf() {
    return this.game.isFinished
  }

  /**
   * Returns true if all moves have been visited at least once
   *
   * @returns {boolean}
   */
  hasMovesLeft() {
    return this.unvisitedMoves.length > 0
  }

  /**
   * Increments the visits and wins
   */
  won() {
    this.visits = this.visits + 1;
    this.wins = this.wins + 1;
  }

  /**
   * Increments the visits by 1 and wins by 0,5
   */
  draw() {
    this.visits = this.visits + 1;
    this.wins = this.wins + 0.5;
  }

  /**
   * Increments the visits
   */
  lost() {
    this.visits = this.visits + 1;
  }

  /**
   * Plays the next untried move and creates a child node for the new game state
   * @returns {Node}
   */
  expand() {
    let nextMove = this.unvisitedMoves.pop();
    let child = new Node(this.game.clone().makeMove(nextMove), nextMove, this);
    this.children.push(child);
    return child;
  }

  /**
   * Updates the statistics for this node depending on the result
   *
   * @param result {number || DRAW}
   */
  update(result) {
    if (result === this.move.player) {
      this.won();
    } else if (result === DRAW) {
      this.draw();
    } else {
      this.lost();
    }
    this.parent.update(result);
  }

  /**
   * Finishes the game with a random player and calls update with the result
   *
   */
  finishRandom() {
    this.update(RandomMCTS.playUntilFinished(this.game.clone()));
  }

  /**
   * Returns the UTC wins for this move
   *
   * @returns {number}
   */
  utcValue() {
    if (this.visits === 0) return Number.POSITIVE_INFINITY;
    let value = this.value() + 2 * (1 / Math.sqrt(2)) * Math.sqrt( 2 * Math.log(this.parent.visits) / this.visits);
    return isNaN(value) ? 0 : value
  }

  /**
   * Returns the percentage of how many times this node has won
   *
   * @returns {number}
   */
  value() {
    let value = this.wins / this.visits;
    return isNaN(value) ? 0 : value
  }

  /**
   * Returns the child with the highest UTC wins
   *
   * @returns {Node}
   */
  utcChild() {
    // this.children.reduce((bestChild, child) =>  {
    //   return !bestChild || child.utcValue() > bestChild.utcValue() ? child : bestChild
    // });
    let children = this.children;
    let highest = children[0];
    for (let i = 1, len = children.length; i < len; i++) {
      let child = children[i];
      if (child.utcValue() > highest.utcValue()) highest = child;
    }
    return highest;
  }

  shouldExplore() {
    return this.hasMovesLeft() || this.isLeaf();
  }
}
