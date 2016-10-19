import Player from "../Player";
import Game from "../Game";
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

function createPromises(count, iterations, fn, callback) {
  let promises = [];
  for (let i = 0; i < iterations || i < 10; i++) {
    count++;
    promises.push(new Promise(fn));
  }
  Promise.all(promises).then(() => {
    count === iterations ? callback() : createPromises(count, iterations, fn, callback)
  });
}



module.exports = function (input, done) {
  let {iterations, body} = input;
  let gameInfo = {
    id: body.gameId,
    player1: Player.create(body.player1),
    player2: Player.create(body.player2)
  };

  createPromises(0, iterations, (resolve) => {
    playGame(new Game(gameInfo.id), gameInfo.player1, gameInfo.player2, result => {
      done({result});
      resolve();
    })
  }, () => done({isFinished: true}));
};
