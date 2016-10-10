import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Statistics from "../components/Statistics";
import * as GameActions from "../actions/GameActions";

class GamePlay extends Component {
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

  handleColumnClick(column, index) {
    const move = {
      gameId: this.props.gameId,
      move: {
        player: this.props.currentPlayer,
        index
      }
    };
    if (column[0] === 0) this.props.makeMove(move);
  }

  renderColumns(column, index) {
    return <div
      key={index}
      className="column"
      style={{width: this.props.cellWidth}}
      onClick={() => this.handleColumnClick(column, index)}>
      {column.reverse().map(this.renderCell.bind(this))}
    </div>
  }

  renderCell(cellValue, index) {
    return <div key={index}
                style={{height: this.props.cellHeight}}
                className={`cell ${cellValue === 0 ? 'white' : cellValue === 1 ? 'red' : 'blue'}`}></div>
  }

  render() {
    const {grid, isFinished, statistics, gridWidth} = this.props;
    return (
      <div>
        <Statistics statistics={statistics}/>
        {!isFinished && <div className="grid-wrapper" style={{width: gridWidth}}>{grid.map(this.renderColumns.bind(this))}</div>}
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
  };
}, {
  makeMove: GameActions.makeMove
})(GamePlay)
