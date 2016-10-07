import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Statistics from "../components/Statistics";
import * as GameActions from "../actions/GameActions";

class TrainingContainer extends Component {
  static propTypes = {
    statistics: PropTypes.shape({
      draw: PropTypes.number.isRequired,
      1: PropTypes.number.isRequired,
      2: PropTypes.number.isRequired
    }),
    isFinished: PropTypes.bool.isRequired,
    trainingsId: PropTypes.string.isRequired,
    updateTraining: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  handleUpdate() {
    this.props.updateTraining(this.props.trainingsId)
  }

  render() {
    const {isFinished, statistics, reset} = this.props;
    return (
      <div>
        {!isFinished && <span>Training still running</span>}
        {isFinished && <span>Training is finished</span>}
        <Statistics statistics={statistics}/>
        <button onClick={reset}>Reset</button>
        <button onClick={this.handleUpdate.bind(this)}>Update Statistics</button>
      </div>
    )
  }
}

export default connect(state => {
  return {
    statistics: state.statistics,
    isFinished: state.training.isFinished,
    trainingsId: state.training.trainingsId
  }
}, {
  updateTraining: GameActions.updateTraining,
  reset: GameActions.reset
})(TrainingContainer)
