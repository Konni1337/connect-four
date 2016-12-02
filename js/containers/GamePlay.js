import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import ScoreBoard from "../components/ScoreBoard";
import * as GameActions from "../actions/GameActions";
import Grid from '../components/Grid';

class GamePlay extends Component {

  handleColumnClick(gameId, currentPlayer) {
    return (index) => this.props.makeAction({gameId: gameId, action: {player: currentPlayer, index}});
  }

  render() {
    const {grid, isFinished, scores, gameId, currentPlayer} = this.props;
    return <div>
      <ScoreBoard scores={scores}/>
      <Grid grid={grid} gridWidth={400} isFinished={isFinished}
            handleCellClick={this.handleColumnClick(gameId, currentPlayer)}/>
      {isFinished &&
      <div style={{width: '50%', margin: '40px auto 20px'}} className="alert alert-success" role="alert">Game Finished!</div>}
    </div>
  }
}

export default connect(state => {
  return {
    gameId: state.game.id,
    grid: state.game.grid,
    isFinished: state.game.isFinished,
    currentPlayer: state.game.currentPlayer,
    scores: state.scores
  };
}, {
  makeAction: GameActions.makeAction
})(GamePlay)
