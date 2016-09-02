import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import * as GameFixtures from "../constants/GameFixtures";
import uuid from 'node-uuid';
import * as GameActions from "../actions/GameActions";

class GameStart extends Component {
  static propTypes = {
    gameType: PropTypes.string.isRequired,
    trainingIterations: PropTypes.number.isRequired,
    changeTrainingIterations: PropTypes.func.isRequired,
    startGame: PropTypes.func.isRequired,
    changeGameType: PropTypes.func.isRequired
  };

  renderPlayerOption(playerType, index) {
    return <option key={index} value={playerType}>{playerType}</option>
  }

  handleChangeTrainingIterations(event) {
    this.props.changeTrainingIterations(parseInt(event.target.value))
  }

  handleStartGame(event) {
    event.preventDefault();
    const gameInfo = {
      gameId: uuid.v1(),
      gameType: this.props.gameType,
      trainingIterations: this.props.trainingIterations,
      player1: {
        params: {
          id: 1
        },
        algorithm: this.refs.player1.value
      },
      player2: {
        params: {
          id: 2
        },
        algorithm: this.refs.player2.value
      }
    };
    this.props.startGame(gameInfo)
  }

  render() {
    const {gameType, trainingIterations, changeGameType} = this.props;
    return (
      <div>
        {gameType === GameFixtures.GAME_TYPE_NONE &&
        <div>
          <button onClick={() => changeGameType(GameFixtures.GAME_TYPE_NORMAL)}>Play Game</button>
          <button onClick={() => changeGameType(GameFixtures.GAME_TYPE_TRAINING)}>Training</button>
        </div>
        }
        {gameType === GameFixtures.GAME_TYPE_NORMAL &&
        <div>
          <select className="player-select" ref="player1">
            {GameFixtures.PLAYER_TYPES.map(this.renderPlayerOption)}
          </select>
          <select className="player-select" ref="player2">
            {GameFixtures.PLAYER_TYPES.map(this.renderPlayerOption)}
          </select>
        </div>
        }
        {gameType === GameFixtures.GAME_TYPE_TRAINING &&
        <div>
          <label>Traning Iterations</label>
          <input ref="trainingIterations" type="number" value={trainingIterations}
                 onChange={this.handleChangeTrainingIterations.bind(this)}/>
          <select className="player-select" ref="player1">
            {GameFixtures.PLAYER_TYPES_FOR_TRAINING.map(this.renderPlayerOption)}
          </select>
          <select className="player-select" ref="player2">
            {GameFixtures.PLAYER_TYPES_FOR_TRAINING.map(this.renderPlayerOption)}
          </select>
        </div>
        }
        {gameType !== GameFixtures.GAME_TYPE_NONE &&
        <div>
          <button onClick={() => changeGameType(GameFixtures.GAME_TYPE_NONE)}>Back</button>
          <button onClick={this.handleStartGame.bind(this)}>Start Game</button>
        </div>
        }
      </div>
    )
  }
}

export default connect(state => {
  return {
    gameType: state.gameType,
    trainingIterations: state.trainingIterations
  }
}, {
  changeTrainingIterations: GameActions.changeTrainingIterations,
  startGame: GameActions.startGame,
  changeGameType: GameActions.changeGameType
})(GameStart)
