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

class GameContainer extends Component {
  render() {
    const {step, isRunning, startGame, iterations, grid, player1, player2, startTraining, showStatistics} = this.props;
    return (
      <div className="container content">
        <Menu />
        <ErrorContainer />
        {!isRunning && <div>
          {step === 1 && <GameForm handleSubmit={() => startGame(grid, player1, player2)}/>}
          {step === 2 && <TrainingsForm handleSubmit={() => startTraining(iterations, grid, player1, player2)}/>}
          {step === 3 && <StatisticsForm handleSubmit={() => showStatistics({})}/>}
        </div>}
        {isRunning && step === 1 && <GamePlay />}
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
    player1: state.player.player1,
    player2: state.player.player2,
    iterations: state.training.iterations
  }
}, {
  startGame: GameActions.startGame,
  startTraining: TrainingsActions.startTraining,
  showStatistics: GameActions.showStatistics
})(GameContainer)
