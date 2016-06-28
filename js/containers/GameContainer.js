import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Statistics from "../components/Statistics";
import Grid from "../components/Grid";
import Game from "../lib/Game";
import PlayerControls from './PlayerControls';
import {PLAYER_TYPES} from '../constants/GameFixtures';
import {HUMAN} from "../constants/GameFixtures";
import * as GameActions from "../actions/GameActions";

function renderOptions(move, index) {
  return <option key={index} value={move.index}>{move.index + 1}</option>
}

function renderPlayerOption(playerType, index) {
  if (playerType === HUMAN && this.props.isTraining) return;
  return <option key={index} value={playerType}>{playerType}</option>
}

class GameContainer extends Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired,
    statistics: PropTypes.shape({
      draw: PropTypes.number.isRequired,
      1: PropTypes.number.isRequired,
      2: PropTypes.number.isRequired
    }),
    players: PropTypes.shape({
      player1: PropTypes.object,
      player2: PropTypes.object
    }).isRequired,
    isStarted: PropTypes.bool.isRequired,
    isTraining: PropTypes.bool.isRequired,
    trainingIterations: PropTypes.number.isRequired
  };

  handleStartGame(event) {
    event.preventDefault();
    let player1 = this.refs.player1.value;
    let player2 = this.refs.player2.value;
    let trainingIterations = this.refs.trainingIterations.value;
    let isTraining = this.props.isTraining;
    this.props.startGame(player1, player2, trainingIterations, isTraining)
  }

  render() {
    const {game, statistics, isStarted, players, isTraining, toggleIsTraining, trainingIterations, setTrainingIterations} = this.props;
    return (
      <div>
        <Statistics statistics={statistics}/>
        {!isStarted &&
        <input type="checkbox" ref="isTraining" value={isTraining} onChange={toggleIsTraining} />}
        {!isStarted && isTraining && <div>
          <label>Traning Iterations</label>
          <input ref="trainingIterations" type="number" value={trainingIterations} onChange={setTrainingIterations}/>
        </div>
        }
        <select ref="player1">{PLAYER_TYPES.map(renderPlayerOption.bind(this))}</select>
        <select ref="player2">{PLAYER_TYPES.map(renderPlayerOption.bind(this))}</select>

        {!isStarted && <button onClick={this.handleStartGame.bind(this)}>Start Game</button>}

        {isStarted && !game.isFinished && <div>
          <PlayerControls game={game} players={players}/>
          <Grid grid={game.grid}/>
        </div>
        }
      </div>
    )
  }
}

export default connect(state => state, {
  setTrainingIterations: GameActions.setTrainingIterations,
  toggleIsTraining: GameActions.toggleIsTraining,
  startGame: GameActions.startGame,
  makeMove: GameActions.makeMove
})(GameContainer)
