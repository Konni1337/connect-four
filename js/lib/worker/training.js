import Player from "../Player";
import Game from "../Game";

let id, grid, player1, player2;

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
    playGame(new Game(id, grid.columns, grid.rows), result => {
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
  grid = body.grid;
  Player.create(body.player1, newPlayer1 => {
    player1 = newPlayer1;
    Player.create(body.player2, newPlayer2 => {
      player2 = newPlayer2;
      playGames(0, iterations, done, progress)
    });
  });
};
