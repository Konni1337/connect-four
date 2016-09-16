import winston from 'winston';

function stateForPlayer(grid, playerId) {
  const stateArray = [];
  for (let y = grid[0].length - 1; y >= 0 ; y--) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[x][y] === playerId) stateArray.push(x);
    }
  }
  return stateArray;
}

export default function (stateAction) {
  let grid = stateAction.state; // 2D grid array
  const player1State = stateForPlayer(grid, 1);
  const player2State = stateForPlayer(grid, 2);
  let stateString = player1State.reduce(function (stateString, value, index) {
    if (player2State.length === index) {
      return stateString + value;
    } else {
      return stateString + value + player2State[index];
    }
  }, '');
  // winston.info('get string: ' + stateAction.action.index + '.' + stateString)
  return stateAction.action.index + '.' + stateString;
}