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
      <form className="form-horizontal small-form">
        {gameType === GameFixtures.GAME_TYPE_NONE &&
        <span>
          <button className="btn btn-primary"
                  onClick={() => changeGameType(GameFixtures.GAME_TYPE_NORMAL)}>Play Game</button>
          <button className="btn btn-primary"
                  onClick={() => changeGameType(GameFixtures.GAME_TYPE_TRAINING)}>Training</button>
        </span>
        }
        {gameType === GameFixtures.GAME_TYPE_NORMAL &&
        <div className="form-horizontal">
          <div className="form-group">
            <label htmlFor="player1-select" className="col-sm-2 control-label">Player 1</label>
            <div className="col-sm-10">
              <select id="player1-select" className="form-control player-select" ref="player1">
                {GameFixtures.PLAYER_TYPES.map(this.renderPlayerOption)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="player2-select" className="col-sm-2 control-label">Player 2</label>
            <div className="col-sm-10">
              <select id="player2-select" className="form-control player-select" ref="player2">
                {GameFixtures.PLAYER_TYPES.map(this.renderPlayerOption)}
              </select>
            </div>
          </div>
        </div>
        }
        {gameType === GameFixtures.GAME_TYPE_TRAINING &&
        <div>
          <div className="form-group">
            <label htmlFor="trainingIterations" className="col-sm-2 control-label">Iterations</label>
            <div className="col-sm-10">
              <input id="trainingIterations"
                     className="form-control"
                     ref="trainingIterations"
                     type="number"
                     value={trainingIterations}
                     onChange={this.handleChangeTrainingIterations.bind(this)}/>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="player1-select" className="col-sm-2 control-label">Player 1</label>
            <div className="col-sm-10">
              <select id="player1-select" className="form-control player-select" ref="player1">
                {GameFixtures.PLAYER_TYPES_FOR_TRAINING.map(this.renderPlayerOption)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="player2-select" className="col-sm-2 control-label">Player 2</label>
            <div className="col-sm-10">
              <select id="player2-select" className="form-control player-select" ref="player2">
                {GameFixtures.PLAYER_TYPES_FOR_TRAINING.map(this.renderPlayerOption)}
              </select>
            </div>
          </div>
        </div>
        }
        {gameType !== GameFixtures.GAME_TYPE_NONE &&
        <div>
          <button className="btn btn-default" onClick={() => changeGameType(GameFixtures.GAME_TYPE_NONE)}>Back</button>
          <button className="btn btn-primary" onClick={this.handleStartGame.bind(this)}>Start Game</button>
        </div>
        }
      </form>
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
