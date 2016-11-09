import Game from "../../Game";

export default function stateToString(grid) {
  let result = '';
  for(let i = 0 , len = grid.length ; i < len ; i++){
    for(let j = 0, len = grid[i].length; j < len ; j++){
      let value = grid[i][j];
      result += value;
      if (value === 0) break;
    }
  }
  return result;
}

export function stateActionString(stringState, action) {
  return stringState + '.' + action.index
}

export function importedStateToString(state, action) {
  let simulatedGame = new Game();
  state.split('').forEach(index => {
    index = parseInt(index);
    if (isNaN(index)) throw 'index should be a int, but index is ' + index;
    simulatedGame.makeMove({index, player: simulatedGame.currentPlayer})
  });
  return stateToKeyString({state: simulatedGame.grid, action: {index: action}});
}
