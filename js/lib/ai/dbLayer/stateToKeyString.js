export default function stateToKeyString(stateAction) {
  let grid = stateAction.state; // 2D grid array
  let result = '';
  for(let i = 0 , len = grid.length ; i < len ; i++){
    for(let j = grid[i].length - 1 ; j > -1 ; j--){
      let value = grid[i][j];
      result += value;
      if (value === 0) break;
    }
  }
  return result + '.' + stateAction.action;
}
