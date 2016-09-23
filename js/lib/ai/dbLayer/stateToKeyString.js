import winston from 'winston';
//
// function stateForPlayer(grid, playerId) {
//   const stateArray = [];
//   for (let y = grid[0].length - 1; y >= 0 ; y--) {
//     for (let x = 0; x < grid.length; x++) {
//       if (grid[x][y] === playerId) stateArray.push(x);
//     }
//   }
//   return stateArray;
// }

export default function (stateAction) {
  let grid = stateAction.state; // 2D grid array
  let result = '';
  for(var i = 0 , len = grid.length ; i < len ; i++){
    for(var j = grid[i].length - 1 ; j > -1 ; j--){
      let value = grid[i][j];
      result += value;
      if (value === 0) break;
    }
  }
  console.log(result);
  return result;
}