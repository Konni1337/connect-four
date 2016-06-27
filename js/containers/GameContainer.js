import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Statistics from "../components/Statistics";
import Grid from "../components/Grid";
import * as GameActions from "../actions/GameActions";
import Game from "../lib/Game";
import PlayerControls from './PlayerControls';
import {PLAYER_TYPES} from '../constants/GameFixtures';

function renderOptions(move, index) {
  return <option key={index} value={move.index}>{move.index + 1}</option>
}

function renderPlayerOption(playerType, index) {
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
    players: PropTypes.arrayOf(String).isRequired,
    values: PropTypes.arrayOf(Number).isRequired,
    isStarted: PropTypes.bool.isRequired
  };

  handleStartGame(event) {
    event.preventDefault();
    this.props.startGame(this.refs.player1.value, this.refs.player2.value)
  }

  handleMakeMove(event, moves) {
    event.preventDefault();
    let node = this.refs.moves;
    let value = node.options[node.selectedIndex].value;
    this.props.makeMove(moves[value], this.props.game)
  }

  render() {
    const {game, statistics, isStarted, values, players} = this.props;
    const moves = game.getValidMoves();
    return (
      <div>
        <Statistics statistics={statistics}/>

        <select ref="player1">{PLAYER_TYPES.map(renderPlayerOption)}</select>
        <select ref="player2">{PLAYER_TYPES.map(renderPlayerOption)}</select>

        {!isStarted && <button onClick={this.handleStartGame.bind(this)}>Start Game</button>}

        {isStarted && !game.isFinished && <div>
          <PlayerControls game={game} players={players}/>
          <Grid grid={game.grid} values={values}/>
        </div>
        }
      </div>
    )
  }
}

export default connect(state => state, {
  startGame: GameActions.startGame,
  makeMove: GameActions.makeMove
})(GameContainer)
