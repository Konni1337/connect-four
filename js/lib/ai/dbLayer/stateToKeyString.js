import Game from "../../Game";

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

export function importedStateToString(state, action) {
  let simulatedGame = new Game();
  state.split('').forEach(index => {
    index = parseInt(index);
    if (isNaN(index)) throw 'index should be a int, but index is ' + index;
    simulatedGame.makeMove({index, player: simulatedGame.currentPlayer})
  });
  return stateToKeyString({state: simulatedGame.grid, action});
}
