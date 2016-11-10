import React, {Component, PropTypes} from "react";


class ScoreBoard extends Component {
  render() {
    const {scores} = this.props;
    return (
      <div>
        <h3>Points</h3>
        <table className="table statistics-table" width="300">
          <thead>
            <tr>
              <th>Player 1</th>
              <th>Player 2</th>
              <th>Draw</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{scores[1]}</td>
              <td>{scores[2]}</td>
              <td>{scores.draw}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
};

ScoreBoard.propTypes = {
  scores: PropTypes.shape({
    draw: PropTypes.number.isRequired,
    1: PropTypes.number.isRequired,
    2: PropTypes.number.isRequired
  })
};

export default ScoreBoard
