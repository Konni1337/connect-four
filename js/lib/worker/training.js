import Player from "../Player";
import Game from "../Game";
import winston from 'winston';
/**
 * Plays one game and updates the result
 * @param game
 * @param player1
 * @param player2
 * @param callback
 * @returns {*}
 */
function playGame(game, player1, player2, callback) {
  if (game.isFinished) return callback(game.result);
  let currentPlayer = game.currentPlayer === 1 ? player1 : player2;
  return currentPlayer.selectAction(game, move => playGame(game.makeMove(move), player1, player2, callback));
}

module.exports = function (input, done) {
  let {iterations, body} = input;
  let id = body.gameId;
  let player1 = Player.create(body.player1, true);
  let player2 = Player.create(body.player2, true);
  let gamePromises = [];
  for (let i = 0; i < iterations; i++) {
    gamePromises.push(new Promise(resolve => {
      playGame(new Game(id), player1, player2, result => {
        winston.info('here');
        done({result});
        resolve();
      });
    }));
  }
  Promise.all(gamePromises).then(() => done({isFinished: true}));
};
