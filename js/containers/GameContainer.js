import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Statistics from "../components/Statistics";
import Grid from "../components/Grid";
import * as GameActions from "../actions/GameActions";
import Game from "../lib/Game";

function renderOptions(move, index) {
  return <option key={index} value={move.index}>{move.index + 1}</option>
}

class GameContainer extends Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired,
    statistics: PropTypes.shape({
      draw: PropTypes.number.isRequired,
      1: PropTypes.number.isRequired,
      2: PropTypes.number.isRequired
    }),
    isStarted: PropTypes.bool.isRequired
  };

  handleStartGame(event) {
    event.preventDefault();
    this.props.startGame()
  }

  handleMakeMove(event, moves) {
    event.preventDefault();
    let node = this.refs.moves;
    let value = node.options[node.selectedIndex].value;
    this.props.makeMove(moves[value], this.props.game)
  }

  render() {
    const {game, statistics, isStarted, values} = this.props;
    const moves = game.getValidMoves();
    return (
      <div>
        <Statistics statistics={statistics}/>
        <button onClick={this.handleStartGame.bind(this)}>Start Game</button>
        {isStarted && !game.isFinished && <div>
          <select ref="moves">{moves.map(renderOptions)}</select>
          <button onClick={event => this.handleMakeMove(event, moves)}>Make Move</button>
        </div>
        }
        <Grid grid={game.grid} values={values}/>
        {game.isFinished && <strong>{'Player ' + game.result + ' won!'}</strong>}
      </div>
    )
  }
}

export default connect(state => state, {
  startGame: GameActions.startGame,
  makeMove: GameActions.makeMove
})(GameContainer)
