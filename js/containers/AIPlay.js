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
    statistics: PropTypes.shape({
      draw: PropTypes.number.isRequired,
      1: PropTypes.number.isRequired,
      2: PropTypes.number.isRequired
    }),
    gameId: PropTypes.string.isRequired,
    isFinished: PropTypes.bool.isRequired,
    currentPlayer: PropTypes.number.isRequired,
    makeMove: PropTypes.func.isRequired
  };

  render() {
    const {grid, isFinished, statistics, makeMove, gameId} = this.props;
    return (
      <div>
        <Statistics statistics={statistics}/>
        {!isFinished && <Grid grid={grid} gridWidth={400} handleCellClick={() => {
        }}/>}
        <button className="btn btn-primary ai-move" onClick={() => makeMove({gameId})}>Do AI Move</button>
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
    statistics: state.statistics
  }
}, {
  makeMove: GameActions.makeMove
})(AIPlay)
