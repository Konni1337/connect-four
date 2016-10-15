import React, {Component, PropTypes} from "react";


export default class Grid extends Component {
  static propTypes = {
    grid: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
    ).isRequired,
    gridWidth: PropTypes.number.isRequired,
    handleCellClick: PropTypes.func.isRequired
  };


  renderColumns(column, index) {
    return <div
      key={index}
      className="column"
      style={{width: this.cellWidth}}
      onClick={() => column[0] === 0 && this.props.handleCellClick(index)}>
      {column.reverse().map(this.renderCell.bind(this))}
    </div>
  }

  renderCell(cellValue, index) {
    return <div
      key={index}
      style={{height: this.cellHeight}}
      className={`cell ${cellValue === 0 ? 'white' : cellValue === 1 ? 'red' : 'blue'}`}>
    </div>
  }

  render() {
    const {grid, gridWidth} = this.props;
    this.cellWidth = 400 / grid[0].length;
    this.cellHeight = 400 / grid[0].length;
    return <div className="grid-wrapper" style={{width: gridWidth}}>{grid.map(this.renderColumns.bind(this))}</div>
  }
};


