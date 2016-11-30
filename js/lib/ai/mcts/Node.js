import RandomMCTS from "./RandomMCTS";
import {DRAW} from "../../../constants/GameFixtures";
import {getRandomElement} from "../../../helpers/CommonHelper";

export default class Node {
  constructor(game, action, parent) {
    this.game = game;
    this.action = action;
    this.parent = parent;
    this.wins = 0;
    this.visits = 0;
    this.children = [];
    this.unvisitedActions = game.getValidActions();
  }

  clone() {
    let action = this.action && JSON.parse(JSON.stringify(this.action));
    let node = new Node(this.game.clone(), action);
    node.parent = this.parent && this.parent.clone();
    node.wins = this.wins;
    node.visits = this.visits;
    node.children = this.children.map(child => child.clone());
    node.unvisitedActions = this.unvisitedActions.slice();
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
   * Returns true if all actions have been visited at least once
   *
   * @returns {boolean}
   */
  hasActionsLeft() {
    return this.unvisitedActions.length > 0
  }

  /**
   * Plays the next untried action and creates a child node for the new game state
   * @returns {Node}
   */
  expand() {
    let nextAction = getRandomElement(this.unvisitedActions);
    let child = new Node(this.game.clone().makeAction(nextAction), nextAction, this);
    this.children.push(child);
    return child;
  }

  /**
   * Updates the statistics for this node depending on the result
   *
   * @param result {number || DRAW}
   */
  update(result) {
    if (result === this.action.player) {
      this._won();
    } else if (result === DRAW) {
      this._draw();
    } else {
      this._lost();
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
   * Returns the UTC wins for this action
   *
   * @returns {number}
   */
  utcValue() {
    if (this.visits === 0) return Number.POSITIVE_INFINITY;
    return this.value() + 2 * (1 / Math.sqrt(2)) * Math.sqrt(Math.log(this.parent.visits) / this.visits);
  }

  /**
   * Returns the child with the highest UTC value. Random when there are multiple.
   *
   * @returns {Node}
   */
  utcChild() {
    let children = this.children;
    let highest = [children[0]];
    for (let i = 1, len = children.length; i < len; i++) {
      let child = children[i];
      if (child.utcValue() === highest[0].utcValue()) highest.push(child);
      if (child.utcValue() > highest[0].utcValue()) highest = [child];
    }
    return getRandomElement(highest);
  }



  /**
   * @private
   * Increments the visits and wins
   */
  _won() {
    this.visits += 1;
    this.wins += 1;
  }

  /**
   * @private
   * Increments the visits by 1 and wins by 0,5
   */
  _draw() {
    this.visits += 1;
    this.wins += 0.5;
  }

  /**
   * @private
   * Increments the visits
   */
  _lost() {
    this.visits += 1;
  }



  /**
   * @private
   * Returns the percentage of how many times this node has won
   *
   * @returns {number}
   */
  value() {
    if (this.visits === 0) return 0;
    return this.wins / this.visits
  }
}
