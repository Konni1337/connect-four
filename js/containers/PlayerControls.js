import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Game from "../lib/Game";
import * as GameActions from "../actions/GameActions";
import {HUMAN} from "../constants/GameFixtures";

class PlayerControls extends Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired,
    players: PropTypes.arrayOf(String).isRequired,
    makeHumanMove: PropTypes.func.isRequired,
    makeMove: PropTypes.func.isRequired
  };

  renderMoves(move, index) {
    return <button key={index} onClick={e => this.handleHumanMove(e, move)}>Push in {move.index + 1}</button>
  }

  handleHumanMove(e, move) {
    e.preventDefault();
    this.props.makeHumanMove(move, this.props.game);
  }

  handleMakeMove(e) {
    e.preventDefault();
    this.props.makeMove(this.props.game);
  }

  render() {
    const {game, players} = this.props;
    if (players[game.currentPlayer - 1] === HUMAN) {
      return <div>
        {game.getValidMoves().map(this.renderMoves.bind(this))}
      </div>
    } else {
      return <button onClick={this.handleMakeMove.bind(this)}>Make AI Moves</button>
    }
  }
}

export default connect(state => state, {
  makeHumanMove: GameActions.makeHumanMove,
  makeMove: GameActions.makeMove
})(PlayerControls)
