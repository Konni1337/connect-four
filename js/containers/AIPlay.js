import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Statistics from "../components/Statistics";
import * as GameActions from "../actions/GameActions";
import Grid from '../components/Grid';

class AIPlay extends Component {
  static propTypes = {
    grid: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
    ).isRequired,
    scores: PropTypes.shape({
      draw: PropTypes.number.isRequired,
      1: PropTypes.number.isRequired,
      2: PropTypes.number.isRequired
    }),
    gameId: PropTypes.string.isRequired,
    isFinished: PropTypes.bool.isRequired,
    currentPlayer: PropTypes.number.isRequired,
    makeAction: PropTypes.func.isRequired
  };

  render() {
    const {grid, isFinished, scores, makeAction, gameId} = this.props;
    return (
      <div>
        <Statistics scores={scores}/>
        {!isFinished && <Grid grid={grid} gridWidth={400} handleCellClick={() => {
        }}/>}
        <button className="btn btn-primary ai-action" onClick={() => makeAction({gameId})}>Do AI Action</button>
      </div>
    )
  }
}

export default connect(state => {
  return {
    gameId: state.game.id,
    grid: state.game.grid,
    isFinished: state.game.isFinished,
    currentPlayer: state.game.currentPlayer,
    scores: state.scores
  }
}, {
  makeAction: GameActions.makeAction
})(AIPlay)
