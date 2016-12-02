import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import GamePlay from "./GamePlay";
import * as GameActions from '../actions/GameActions';
import * as TrainingsActions from '../actions/TrainingsActions';
import ErrorContainer from "./ErrorContainer";
import Menu from './Menu';
import Training from './Training';
import GameForm from './forms/GameForm';
import TrainingsForm from './forms/TrainingsForm';
import StatisticsForm from './forms/StatisticsForm';
import * as StepActions from "../actions/StepActions";

class GameContainer extends Component {
  render() {
    const {step, isRunning, startGame, iterations, grid, player, game, startTraining, showStatistics, reset} = this.props;
    const {player1, player2} = player;
    return (
      <div className="container content">
        <Menu />
        <ErrorContainer />
        {!isRunning && <div>
          {step === 1 && <GameForm handleSubmit={() => startGame(grid, player1, player2)}/>}
          {step === 2 && <TrainingsForm handleSubmit={() => startTraining(iterations, grid, player1, player2)}/>}
          {step === 3 && <StatisticsForm handleSubmit={() => showStatistics({})}/>}
        </div>}
        {isRunning && step === 1 && <div>
          <GamePlay />
          {game.isFinished && <div>
            <hr style={{position: 'absolute', left: '10%', width: '80%'}}/>
            <div style={{paddingTop: '55px'}}></div>
            <button className="btn btn-default" onClick={reset}>Reset</button>
            <button className="btn btn-primary" onClick={() => startGame(grid, player1, player2, game.id)}>
              New Game
            </button>
          </div>}
        </div>}
        {isRunning && step === 2 && <Training />}
      </div>
    )
  }
}

GameContainer.propTypes = {};

export default connect(state => {
  return {
    step: state.steps.menu,
    isRunning: state.gameInfo.isRunning,
    grid: state.grid,
    player: state.player,
    iterations: state.training.iterations,
    game: state.game
  }
}, {
  startGame: GameActions.startGame,
  startTraining: TrainingsActions.startTraining,
  showStatistics: GameActions.showStatistics,
  reset: StepActions.reset
})(GameContainer)
