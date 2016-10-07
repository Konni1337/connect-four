import {getRandomElement} from "../../../helpers/commonHelper";
import Game from '../../Game';

/**
 * Random player that is only used for MCTS to finsish a game randomly
 */
export default class RandomMCTS {
  static playUntilFinished(game) {
    while (!game.isFinished) {
      let finishMove = this.findFinishMove(game.grid, game.currentPlayer);
      if (finishMove.index !== -1) {
        game.makeMove(finishMove);
      } else {
        game.makeMove(getRandomElement(game.getValidMoves()));
      }
    }
    return game.result;
  }

  static findFinishMove(grid, player) {
    let result = -1;
    for (let x = 0, len = grid.length; x < len; x++) {
      let y = grid[x].findIndex(value => value === 0);
      if (y >= 0) {
        grid[x][y] = player;
        if (Game.findResult(grid) === player) {
          result = x;
          grid[x][y] = 0;
          break;
        } else {
          grid[x][y] = 0;
        }
      }
    }
    return {index: result, player: player};
  }

}
