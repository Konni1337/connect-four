import {DRAW} from "../constants/GameFixtures";

const GRID_LENGTH = 5;
const GRID_HEIGHT = 5;

export default class Game {
  constructor() {
    let grid = new Array(GRID_LENGTH);
    for (let x = 0; x < GRID_LENGTH; x++) {
      grid[x] = [];
      for (let y = 0; y < GRID_HEIGHT; y++) {
        grid[x][y] = 0;
      }
    }
    this.grid = grid;
    this.isFinished = false;
    this.result = null;
    this.currentPlayer = 1;
  }

  static fromGame(game) {
    let newGame = new Game();
    newGame.grid = JSON.parse(JSON.stringify(game.grid));
    newGame.isFinished = game.isFinished;
    newGame.result = game.result;
    newGame.currentPlayer = game.currentPlayer;
    return newGame;
  }

  getValidMoves() {
    return this.grid.reduce((moves, column, index) => {
      if (column[0] === 0) return moves.concat({index, player: this.currentPlayer});
      return moves
    }, [])
  }

  makeMove(move) {
    this.push(move)
  }

  push({index, player}) {
    let pushIndex = this.grid[index].findIndex(value => value !== 0);
    if (pushIndex === -1) {
      this.grid[index][GRID_HEIGHT - 1] = player
    } else {
      this.grid[index][pushIndex - 1] = player;
    }
    let result = this.getPlayerWithFourInARow();
    if (result !== -1) {
      this.isFinished = true;
      this.result = result;
    }
    this.currentPlayer === 1 ? this.currentPlayer = 2 : this.currentPlayer = 1;
  }

  isFull() {
    return this.grid.every(column => column[0] !== 0);
  }

  getPlayerWithFourInARow() {
    let grid = this.grid;
    let finishedPlayer = -1;
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        let player = grid[x][y];
        if (player !== 0) {
          let downRight = x <= grid.length - 4
            && y <= grid[x].length - 4
            && grid[x + 1][y + 1] === player
            && grid[x + 2][y + 2] === player
            && grid[x + 3][y + 3] === player;
          let upRight = x >= 3
            && y <= grid[x].length - 4
            && grid[x - 1][y + 1] === player
            && grid[x - 2][y + 2] === player
            && grid[x - 3][y + 3] === player;
          let down = y <= grid[x].length - 4
            && grid[x][y + 1] === player
            && grid[x][y + 2] === player
            && grid[x][y + 3] === player;
          let right = x <= grid.length - 4
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
    if (finishedPlayer < 0 && this.isFull()) return DRAW;
    return finishedPlayer
  }
}