import {START_GAME, MAKE_MOVE, END_GAME} from "../constants/gameActionTypes";
import MonteCarloTreeSearch from "../lib/ai/mcts/MonteCarloTreeSearch";
import Game from "../lib/Game";


export function startGame(player1, player2) {
  return {type: START_GAME, players: [player1, player2]}
}

export function makeHumanMove(move, game) {
  return dispatch => {
    let newGame = Game.fromGame(game);
    newGame.makeMove(move);
    dispatch({type: MAKE_MOVE, game: newGame, values: []});
    if (newGame.isFinished) {
      dispatch({type: END_GAME, result: newGame.result});
    }
  }
}

export function makeMove(game) {
  return dispatch => {
    let newGame = Game.fromGame(game);
    let mcts = new MonteCarloTreeSearch(newGame);
    newGame.makeMove(mcts.findBestMove());
    dispatch({type: MAKE_MOVE, game: newGame, values: mcts.values()});
    if (newGame.isFinished) {
      dispatch({type: END_GAME, result: newGame.result});
    }
  }
}


