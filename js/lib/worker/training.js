import Player from "../Player";
import Game from "../Game";
import winston from 'winston';

let id, player1, player2;

/**
 * Plays one game and updates the result
 * @param game
 * @param callback
 * @returns {*}
 */
function playGame(game, callback) {
  if (game.isFinished) return callback(game.result);
  let currentPlayer = game.currentPlayer === 1 ? player1 : player2;
  return currentPlayer.selectAction(game, move => playGame(game.makeMove(move), callback));
}

function playGames(current, max, done, progress) {
  if (current === max) {
    done();
  } else{
    playGame(new Game(id), result => {
      player1.endGame(result, () => {
        player2.endGame(result, () => {
          progress(result);
          playGames(current + 1, max, done, progress);
        })
      })
    });
  }
}

module.exports = function (input, done, progress) {
  let {iterations, body} = input;
  id = body.gameId;
  player1 = Player.create(body.player1);
  player2 = Player.create(body.player2);
  playGames(0, iterations, done, progress)
};
