import {
  START_GAME,
  MAKE_MOVE,
  END_GAME,
  TOGGLE_IS_TRAINING,
  SET_TRAINING_ITERATIONS
} from "../constants/gameActionTypes";
import MonteCarloTreeSearch from "../lib/ai/mcts/MonteCarloTreeSearch";
import Game from "../lib/Game";
import QLearning from '../lib/ai/q-learning/QLearning';
import {HUMAN, MCTS, Q_LEARNING, RANDOM} from "../constants/GameFixtures";
import Human from "../lib/Human";
import QLearningParams from "../lib/ai/q-learning/QLearningParams";
import Random from "../lib/ai/random/Random";
import Experience from "../lib/ai/q-learning/Experience";

function parsePlayer(playerType, id) {
  switch (playerType) {
    case HUMAN:
      return new Human(id);
    case MCTS:
      return new MonteCarloTreeSearch(id);
    case Q_LEARNING:
      return new QLearning(new QLearningParams(id, {experience: new Experience(id)}));
    case RANDOM:
      return new Random(id);
    default:
      return new Human(id);
  }
}

export function startGame(player1, player2, trainingIterations, isTraining) {
  return dispatch => {
    if (isTraining) {
      training(parsePlayer(player1, 1), parsePlayer(player2, 2), trainingIterations, dispatch)
    } else {
      dispatch({type: START_GAME, player1: parsePlayer(player1, 1), player2: parsePlayer(player2, 2)});
    }
  }
}

export function makeHumanMove(move, game) {
  return dispatch => {
    let newGame = game.clone();
    newGame.makeMove(move);
    dispatch({type: MAKE_MOVE, game: newGame, values: []});
    if (newGame.isFinished) {
      dispatch({type: END_GAME, result: newGame.result});
    }
  }
}

export function makeMove(game, player) {
  return dispatch => {
    let newGame = game.clone();
    player.selectAction(game, (move) => {
      newGame.makeMove(move);
      dispatch({type: MAKE_MOVE, game: newGame});
      if (newGame.isFinished) {
        dispatch({type: END_GAME, result: newGame.result});
      }
    })

  }
}

export function toggleIsTraining(e) {
  return {type: TOGGLE_IS_TRAINING, isTraining: e.target.checked}
}

export function setTrainingIterations(e) {
  return {type: SET_TRAINING_ITERATIONS, trainingIterations: parseInt(e.target.value)}
}

function training(player1, player2, trainingIterations, dispatch) {
  playGames(0, trainingIterations, player1, player2, dispatch);
}

function playGames(times, maxTimes, player1, player2, dispatch) {
  if (times >= maxTimes) return;
  playGame(new Game(), player1, player2, (result) => {
    dispatch({type: END_GAME, result});
    playGames(times + 1, maxTimes, player1, player2, dispatch)
  })
}

function playGame(game, player1, player2, callback) {
  if (game.isFinished) return callback(game.result);
  let currentPlayer = game.currentPlayer === 1 ? player1 : player2;
  currentPlayer.selectAction(game, (move) => {
    game.makeMove(move);
    playGame(game, player1, player2, callback)
  });
}
