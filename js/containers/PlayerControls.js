import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Game from "../lib/Game";
import * as GameActions from "../actions/GameActions";
import {HUMAN} from "../constants/GameFixtures";

class PlayerControls extends Component {
  static propTypes = {
    game: PropTypes.instanceOf(Game).isRequired,
    players: PropTypes.shape({
      player1: PropTypes.object,
      player2: PropTypes.object
    }).isRequired,
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

  handleMakeMove(e, currentPlayer, self) {
    e.preventDefault();
    self.props.makeMove(self.props.game, currentPlayer);
  }

  render() {
    const {game, players} = this.props;
    const currentPlayer = game.currentPlayer === 1 ? players.player1 : players.player2;
    const self = this;
    if (currentPlayer.isHuman()) {
      return <div>
        {game.getValidMoves().map(this.renderMoves.bind(this))}
      </div>
    } else {
      return <button onClick={e => this.handleMakeMove(e, currentPlayer, self)}>Make AI Moves</button>
    }
  }
}

export default connect(state => state, {
  makeHumanMove: GameActions.makeHumanMove,
  makeMove: GameActions.makeMove
})(PlayerControls)
