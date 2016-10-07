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
    return <div key={index} className="column" onClick={() => this.handleColumnClick(column, index)}>
      {column.reverse().map(this.renderCell)}
    </div>
  }

  renderCell(cellValue, index) {
    return <div key={index} className={`cell ${cellValue === 0 ? 'white' : cellValue === 1 ? 'red' : 'blue'}`}></div>
  }

  render() {
    const {grid, isFinished, statistics} = this.props;
    return (
      <div>
        <Statistics statistics={statistics}/>
        {!isFinished && <div>
          {grid.map(this.renderColumns.bind(this))}
        </div>
        }
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
})(GamePlay)
