import {DRAW, GRID_LENGTH, GRID_HEIGHT, EMPTY_VALUE} from "../constants/GameFixtures";
import '../utils/arrayExtensions';


/**
 * This class represents a instance of a board of the game.
 */
export default class Game {
  constructor(id, gridLength = GRID_LENGTH, gridHeight = GRID_HEIGHT) {
    let grid = new Array(gridLength);
    for (let x = 0; x < gridLength; x++) {
      grid[x] = [];
      for (let y = 0; y < gridHeight; y++) {
        grid[x][y] = 0;
      }
    }
    this.grid = grid;
    this.isFinished = false;
    this.result = null;
    this.currentPlayer = 1;
    this.id = id;
  }

  /**
   * Creates a copy of the current Game instance
   *
   * @returns {Game}
   */
  clone() {
    let newGame = new Game(this.id);
    newGame.grid = JSON.parse(JSON.stringify(this.grid));
    newGame.isFinished = this.isFinished;
    newGame.result = this.result;
    newGame.currentPlayer = this.currentPlayer;
    return newGame;
  }

  /**
   * This method returns all valid moves the current player is allowed to do
   *
   * @returns {Array.<{number, number}>}
   */
  getValidMoves() {
    let grid = this.grid, currentPlayer = this.currentPlayer, moves = [], height = grid[0].length - 1;
    for (let i = 0, len = grid.length; i < len; i++) {
      if (grid[i][height] === 0) moves.push({index: i, player: currentPlayer})
    }
    return moves;
  }

  /**
   * Executes the given move
   *
   * @param move {number, number}
   * @returns {Game}
   */
  makeMove(move) {
    let column = this.grid[move.index];
    let pushIndex = column.findIndex(value => value === 0);
    if (pushIndex === -1) throw 'Could not make move - column is full';
    column[pushIndex] = move.player;
    let result = Game.findResult(this.grid);
    if (this.isFinished = (result !== -1)) this.result = result;
    this.currentPlayer === 1 ? this.currentPlayer = 2 : this.currentPlayer = 1;
    return this;
  }

  /**
   * Returns true if all columns are full.
   *
   * @returns {boolean}
   */
  static isFull(grid) {
    let isFull = true;
    let height = grid[0].length - 1;
    for (let i = 0, len = grid.length; i < len; i++) {
      if (grid[i][height] === 0) {
        isFull = false;
        break;
      }
    }
    return isFull;
  }

  /**
   * Tries to find a player that has four stones in a row. Returns the player ID that has four in a row.#
   * If the grid is full it returns DRAW.
   * If none is found it returns -1.
   *
   * @returns {number}
   */
  static findResult(grid) {
    let finishedPlayer = -1;
    let gridLength = grid.length;
    let gridHeight = grid[0].length;
    for (let x = 0; x < gridLength; x++) {
      for (let y = 0; y < gridHeight; y++) {
        let player = grid[x][y];
        if (player !== EMPTY_VALUE) {
          let downRight = x <= gridLength - 4
            && y <= gridHeight - 4
            && grid[x + 1][y + 1] === player
            && grid[x + 2][y + 2] === player
            && grid[x + 3][y + 3] === player;
          let upRight = x >= 3
            && y <= gridHeight - 4
            && grid[x - 1][y + 1] === player
            && grid[x - 2][y + 2] === player
            && grid[x - 3][y + 3] === player;
          let down = y <= gridHeight - 4
            && grid[x][y + 1] === player
            && grid[x][y + 2] === player
            && grid[x][y + 3] === player;
          let right = x <= gridLength - 4
            && grid[x + 1][y] === player
            && grid[x + 2][y] === player
            && grid[x + 3][y] === player;
          if (downRight || upRight || down || right) {
            finishedPlayer = player;
            break;
          }
        }
      }
    }
    if (finishedPlayer < 0 && Game.isFull(grid)) return DRAW;
    return finishedPlayer
  }
}
