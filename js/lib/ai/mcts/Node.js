import {UCT_FACTOR} from '../../../constants/GameFixtures';
import RandomMCTS from "./RandomMCTS";
import {DRAW} from "../../../constants/GameFixtures";

export default class Node {
  constructor(game, move, parent) {
    this.parent = parent;
    this.game = game;
    this.move = move;
    this.wins = 0;
    this.visits = 0;
    this.children = [];
    this.currentPlayer = game.currentPlayer;
    this.notVisitedMoves = game.getValidMoves();
  }

  /**
   * Returns false
   *
   * @returns {boolean}
   */
  isRoot() {
    return false;
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
   * Plays the next untried move and creates a child node for the new game state
   * @returns {Node}
   */
  expand() {
    let nextMove = this.notVisitedMoves.pop();
    let game = this.game.clone();
    let child = new Node(game, nextMove, this);
    game.makeMove(nextMove);
    this.children.push(child);
    return child;
  }

  /**
   * Returns true if all moves have been visited at least once
   *
   * @returns {boolean}
   */
  noMovesLeft() {
    return this.notVisitedMoves.length === 0
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
    this.wins = this.wins + 0.01;
  }

  /**
   * Increments the visits
   */
  lost() {
    this.visits = this.visits + 1;
  }

  /**
   * Updates the statistics for this node depending on the result
   *
   * @param result {number || DRAW}
   */
  update(result) {
    if (result === this.currentPlayer) {
      this.won();
    } else if (result === DRAW) {
      this.draw();
    } else {
      this.lost();
    }
    this.parent.update(result);
  }

  /**
   * Finishes the game with a random player
   *
   * @returns {number || DRAW} result of the game
   */
  playRandom() {
    let game = this.game.clone();
    return new RandomMCTS(game).playUntilFinished()
  }

  /**
   * Returns the UTC value for this move
   *
   * @returns {number}
   */
  value() {
    return this.winPercentage() + Math.sqrt(Math.log(this.parent.visits) / (UCT_FACTOR * this.visits))
  }

  /**
   * Returns the percentage of how many times this node has won
   *
   * @returns {number}
   */
  winPercentage() {
    return this.wins / this.visits
  }

  /**
   * Returns the child with the highest UTC value
   *
   * @returns {Node}
   */
  bestChild() {
    return this.children.reduce((highest, node) => {
      if (!highest) return node;
      return node.value() > highest.value() ? node : highest
    })
  }
}