import React, {Component, PropTypes} from "react";


export default class Grid extends Component {
  static propTypes = {
    grid: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
    ).isRequired,
    gridWidth: PropTypes.number.isRequired,
    isFinished: PropTypes.bool.isRequired,
    handleCellClick: PropTypes.func.isRequired
  };


  renderColumns(column, index) {
    return <div
      key={index}
      className="column"
      style={{width: this.cellSize}}
      onClick={() => column[0] === 0 && !this.props.isFinished && this.props.handleCellClick(index)}>
      {column.reverse().map(this.renderCell.bind(this))}
    </div>
  }

  renderCell(cellValue, index) {
    const isEmpty = cellValue === 0;
    
    return <div
      key={index}
      style={{height: this.cellSize, cursor: !isEmpty || this.props.isFinished ? 'auto' : 'pointer'}}
      className={`cell ${isEmpty ? 'gray' : cellValue === 1 ? 'white' : 'black'}`}>
    </div>
  }

  render() {
    const {grid, gridWidth} = this.props;
    this.cellSize = Math.floor(400 / grid.length);
    return <div className="grid-wrapper" style={{width: gridWidth}}>{grid.map(this.renderColumns.bind(this))}</div>
  }
};


