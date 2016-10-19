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
  if (game.isFinished) {
    let result = game.result;
    player1.endGame(result);
    player2.endGame(result);
    return callback(result);
  }
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
  let id = body.gameId;
    let player1 = Player.create(body.player1);
    let player2 = Player.create(body.player2);

  createPromises(0, iterations, (resolve) => {
    playGame(new Game(id), player1.clone(), player2.clone(), result => {
      done({result});
      resolve();
    })
  }, () => done({isFinished: true}));
};
