import {UCT_FACTOR} from '../../../constants/GameFixtures'
import Game from "../../Game";
import RandomPlayer from "../random/RandomPlayer";

function addChild(nextMove, self) {
  let game = Game.fromGame(self.game);
  let child = new Node(game, nextMove, self);  
  game.makeMove(nextMove);
  self.children.push(child);
  return child
}

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

  isRoot() {
    return false;
  }

  isLeaf() {
    return this.game.isFinished
  }

  expand() {
    let nextMove = this.notVisitedMoves.pop();
    return addChild(nextMove, this);
  }

  noMovesLeft() {
    return this.notVisitedMoves.length === 0
  }

  won() {
    this.visits = this.visits + 1;
    this.wins = this.wins + 1;
  }

  lost() {
    this.visits = this.visits + 1;
  }

  update(result) {
    result === this.currentPlayer ? this.won() : this.lost();
    this.parent.update(result);
  }

  playRandom() {
    let game = Game.fromGame(this.game);
    return new RandomPlayer(game).playUntilFinished()
  }

  value() {
    return this.winPercentage() + Math.sqrt(Math.log(this.parent.visits)/(5*this.visits))
  }

  winPercentage() {
    return this.wins / this.visits
  }

  bestChild() {
    return this.children.reduce((highest, node) => {
      if (!highest) return node;
      return node.value() > highest.value() ? node : highest
    })
  }
}