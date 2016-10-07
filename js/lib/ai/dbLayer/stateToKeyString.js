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
  return result;
}