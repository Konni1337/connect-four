import React, {Component, PropTypes} from "react";


export default class Statistics extends Component {
  static propTypes = {
    statistics: PropTypes.shape({
      draw: PropTypes.number.isRequired,
      1: PropTypes.number.isRequired,
      2: PropTypes.number.isRequired
    })
  };

  render() {
    const {statistics} = this.props;
    return (
      <div>
        <h3>Statistics</h3>
        <table>
          <thead>
            <tr>
              <th>Player 1 won</th>
              <th>Player 2 won</th>
              <th>Draw</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{statistics[1]}</td>
              <td>{statistics[2]}</td>
              <td>{statistics.draw}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
};
