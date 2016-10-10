import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Statistics from "../components/Statistics";
import * as GameActions from "../actions/GameActions";

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

  renderColumns(column, index) {
    return <div key={index}
                style={{width: this.props.cellWidth}}
                className="column">{column.reverse().map(this.renderCell.bind(this))}</div>
  }

  renderCell(cellValue, index) {
    return <div key={index}
                style={{height: this.props.cellHeight}}
                className={`cell ${cellValue === 0 ? 'white' : cellValue === 1 ? 'red' : 'blue'}`}></div>
  }

  render() {
    const {grid, isFinished, statistics, makeMove, gameId, gridWidth} = this.props;
    return (
      <div>
        <Statistics statistics={statistics}/>
        {!isFinished && <div className="grid-wrapper" style={{width: gridWidth}}>{grid.map(this.renderColumns.bind(this))}</div>}
        <button className="btn btn-primary ai-move" onClick={() => makeMove({gameId})}>Do AI Move</button>
      </div>
    )
  }
}

export default connect(state => {
  let grid = state.game.grid;
  return {
    gameId: state.game.id,
    grid: grid,
    isFinished: state.game.isFinished,
    currentPlayer: state.game.currentPlayer,
    statistics: state.statistics,
    gridWidth: 400,
    cellWidth: 400 / grid[0].length,
    cellHeight: 400 / grid[0].length
  }
}, {
  makeMove: GameActions.makeMove
})(AIPlay)
