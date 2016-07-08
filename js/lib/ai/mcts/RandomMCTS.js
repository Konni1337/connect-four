import {getRandomElement} from "../../../helpers/commonHelper";

/**
 * Random player that is only used for MCTS to finsish a game randomly
 */
export default class RandomMCTS {
  constructor(game) {
    this.game = game;
  }

  /**
   * Plays the given game instance randomly until it is finished
   *
   * @returns {number || DRAW}
   */
  playUntilFinished() {
    if (this.game.isFinished) return this.game.result;
    let moves = this.game.getValidMoves();
    this.game.makeMove(getRandomElement(moves));
    return this.playUntilFinished()
  }
}