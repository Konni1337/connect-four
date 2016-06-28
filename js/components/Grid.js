import '../../css/app.css';
import React, {Component, PropTypes} from "react";

function renderColumns(column, index) {
  return <div key={index} className="column">{column.map(renderCell)}</div>
}

function renderCell(cellValue, index) {
  let color = cellValue === 0 ? 'white' : cellValue === 1 ? 'red' : 'blue';
  return <div key={index} className="cell" style={{backgroundColor: color}}></div>
}

export default class Grid extends Component {
  static propTypes = {
    grid: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
    ).isRequired
  };

  render() {
    const {grid, values} = this.props;
    return (
      <div>
        {grid.map(renderColumns)}
      </div>
    )
  }
};
