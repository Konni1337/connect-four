import {getRandomElement} from "../../../helpers/commonHelper";

export default class RandomPlayer {
  constructor(game) {
    this.game = game;
  }

  doBestMove() {
    let moves = this.game.getValidMoves();
    this.game.push(getRandomElement(moves));
  }
  
  playUntilFinished() {
    while (!this.game.isFinished) {
      this.doBestMove();
    }
    return this.game.result
  }
}