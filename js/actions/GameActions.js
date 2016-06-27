import {START_GAME, MAKE_MOVE, UPDATE_STATISTICS} from "../constants/gameActionTypes";
import MonteCarloTreeSearch from "../lib/ai/mcts/MonteCarloTreeSearch";
import Game from "../lib/Game";


export function startGame() {
  return {type: START_GAME}
}

export function makeHumanMove(move, game) {
  let newGame = Game.fromGame(game);
  newGame.makeMove(move);
  dispatch({type: MAKE_MOVE, game: newGame, values: []});
  if (newGame.isFinished) {
    dispatch({type: UPDATE_STATISTICS, result: newGame.result});
  }
}

export function makeMove(game) {
  return dispatch => {
    let newGame = Game.fromGame(game);
    newGame.makeMove(move);
    dispatch({type: MAKE_MOVE, game: newGame, values: []});
    if (newGame.isFinished) {
      dispatch({type: UPDATE_STATISTICS, result: newGame.result});
    } else {
      let newAiGame = Game.fromGame(newGame);
      let mcts = new MonteCarloTreeSearch(newAiGame);
      newAiGame.makeMove(mcts.findBestMove());
      dispatch({type: MAKE_MOVE, game: newAiGame, values: mcts.values()});
      if (newAiGame.isFinished) {
        dispatch({type: UPDATE_STATISTICS, result: newAiGame.result});
      }
    }
  }  
}


