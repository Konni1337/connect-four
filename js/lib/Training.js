import Game from "./Game";
import Player from "./Player";

export default class Training {
  constructor(iterations, player1, player2, id) {
    this.iterations = iterations;
    this.player1 = player1;
    this.player2 = player2;
    this.id = id;
  }

  

  /**
   * Start the training session
   * @returns {Training}
   */
  start(callback) {
    for (let i = 0; i < this.iterations; i++) {
      this.playGame(new Game(this.id), result => {
        this.player1.endGame(result);
        this.player2.endGame(result);
        callback(result)
      })
    }
  }

  /**
   * Plays one game and returns the result in the callback
   * @param game
   * @param callback
   */
  playGame(game, callback) {
    if (game.isFinished) return callback(game.result);
    let currentPlayer = game.currentPlayer === 1 ? this.player1 : this.player2;
    currentPlayer.selectAction(game, move => this.playGame(game.makeMove(move), callback));
  }
}