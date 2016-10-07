import RandomMCTS from "./RandomMCTS";
import {DRAW, MCTS_WIN_REWARD, MCTS_DRAW_REWARD, MCTS_LOSE_REWARD} from "../../../constants/GameFixtures";

export default class Node {
  constructor(game, move) {
    this.game = game;
    this.move = move;
    this.summedValue = 0;
    this.visits = 0;
    this.children = [];
    this.unvisitedMoves = game.getValidMoves();
  }

  clone() {
    let move = this.move && JSON.parse(JSON.stringify(this.move));
    let node = new Node(this.game.clone(), move);
    node.summedValue = this.summedValue;
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
   * Increments the visits and summedValue
   */
  won() {
    this.visits = this.visits + 1;
    this.summedValue = this.summedValue + MCTS_WIN_REWARD;
  }

  /**
   * Increments the visits by 1 and summedValue by 0,5
   */
  draw() {
    this.visits = this.visits + 1;
    this.summedValue = this.summedValue + MCTS_DRAW_REWARD;
  }

  /**
   * Increments the visits
   */
  lost() {
    this.visits = this.visits + 1;
    this.summedValue = this.summedValue + MCTS_LOSE_REWARD;
  }

  /**
   * Plays the next untried move and creates a child node for the new game state
   * @returns {Node}
   */
  expand() {
    let nextMove = this.unvisitedMoves.pop();
    let child = new Node(this.game.clone().makeMove(nextMove), nextMove);
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
  }

  /**
   * Finishes the game with a random player
   *
   * @returns {number || DRAW} result of the game
   */
  playRandom() {
    return RandomMCTS.playUntilFinished(this.game.clone());
  }

  /**
   * Returns the UTC summedValue for this move
   *
   * @returns {number}
   */
  utcValue(parentVisits) {
    // let summedValue = this.winPercentage() + 2 * UCT_FACTOR * Math.sqrt(Math.log(parentVisits) / (this.visits));
    let value = this.value() + Math.sqrt(Math.log(parentVisits) / (5 * this.visits));
    return isNaN(value) ? 0 : value
  }

  /**
   * Returns the percentage of how many times this node has won
   *
   * @returns {number}
   */
  value() {
    let value = this.summedValue / this.visits;
    return isNaN(value) ? 0 : value
  }

  /**
   * Returns the child with the highest UTC summedValue
   *
   * @returns {Node}
   */
  utcChild() {
    let children = this.children;
    let highest = children[0];
    for (let i = 1, len = children.length; i < len; i++) {
      let child = children[i];
      if (child.utcValue(this.visits) > highest.utcValue(this.visits)) highest = child;
    }
    return highest;
  }
}
