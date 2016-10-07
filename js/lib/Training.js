import Game from "./Game";
import winston from "winston";

/**
 * Plays one game and updates the result
 * @param game
 * @param player1
 * @param player2
 * @param callback
 * @returns {*}
 */
function playGame(game, player1, player2, callback) {
  let currentPlayer = game.currentPlayer === 1 ? player1 : player2;
  return currentPlayer.selectAction(game, move => {
    if (game.makeMove(move).isFinished) {
      callback(game.result);
    } else {
      playGame(game, player1, player2, callback);
    }
  });
}

export default class Training {
  constructor(iterations, player1, player2, id) {
    this.iterations = iterations;
    this.player1 = player1;
    this.player2 = player2;
    this.id = id;
    this.finishedGames = 0;
    this.statistics = {draw: 0, 1: 0, 2: 0};
    this.maxRunningGames = 10;
    this.currentRunningGames = 0;
    this.progress = 0;
  }


  /**
   * Start the training session
   * @returns {Training}
   */
  start() {
    this.startTime = new Date().getTime();
    this.gameQueue();
  }


  isFinished() {
    return this.finishedGames === this.iterations;
  }

  gameFinishedCall(result) {
    let newProgress = parseInt(this.finishedGames / this.iterations * 100);
    if (newProgress > this.progress) {
      this.progress = newProgress;
      this.logProgress();
    }
    this.statistics[result] += 1;
    this.finishedGames += 1;
    this.currentRunningGames -= 1;
  }

  logProgress() {
    winston.info(this.startTime);
    let elapsedTime = new Date().getTime() - this.startTime;
    let averageTime = elapsedTime / this.progress;
    let secondsRemaining = parseInt((averageTime * (100 - this.progress)) / 1000);
    winston.info(this.progress + '% of the training finished. ~' + secondsRemaining + ' seconds remaining.');
  }


  hasFreeSlots() {
    return this.currentRunningGames < this.maxRunningGames
      && this.finishedGames + this.currentRunningGames < this.iterations
  }

  gameQueue() {
    let self = this;
    setTimeout(function () {
      while(self.hasFreeSlots()) {
        self.currentRunningGames += 1;
        playGame(new Game(self.id), self.player1.clone(), self.player2.clone(), self.gameFinishedCall.bind(self));
      }
      if (!self.isFinished()) {
        self.gameQueue();
      } else {
        self.logProgress();
      }
    }, 100);
  }
}
