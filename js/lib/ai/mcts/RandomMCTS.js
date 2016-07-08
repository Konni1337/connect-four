import {getRandomElement} from "../../../helpers/commonHelper";

/**
 * Random player that is only used for MCTS to finsish a game randomly
 */
export default class RandomMCTS {
  constructor(game) {
    this.game = game;
  }

  /**
   * Executes the a random move
   */
  doBestMove() {
    let moves = this.game.getValidMoves();
    this.game.makeMove(getRandomElement(moves));
  }

  /**
   * Plays the given game instance randomly until it is finished
   *
   * @returns {number || DRAW}
   */
  playUntilFinished() {
    while (!this.game.isFinished) this.doBestMove();
    return this.game.result
  }
}