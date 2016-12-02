import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import ScoreBoard from "../components/ScoreBoard";
import * as TrainingsActions from "../actions/TrainingsActions";
import * as StepActions from "../actions/StepActions";

class Training extends Component {
  handleUpdate() {
    this.props.updateTraining(this.props.trainingsId)
  }

  render() {
    const {isFinished, scores, reset} = this.props;
    return (
      <div>
        {!isFinished &&
        <div style={{width: '50%', margin: '0 auto 20px'}} className="alert alert-warning" role="alert">
          Training still running!
        </div>}
        {isFinished &&
        <div style={{width: '50%', margin: '0 auto 20px'}} className="alert alert-success" role="alert">
          Training is finished!
        </div>}
        <ScoreBoard scores={scores}/>
        {isFinished &&
        <button className="btn btn-default" onClick={reset}>Reset</button>}
        {!isFinished &&
        <button className="btn btn-default" onClick={this.handleUpdate.bind(this)}>Update Statistics</button>}
      </div>
    )
  }
}

export default connect(state => {
  return {
    scores: state.scores,
    isFinished: state.training.isFinished,
    trainingsId: state.training.trainingsId
  }
}, {
  updateTraining: TrainingsActions.updateTraining,
  reset: StepActions.reset
})(Training)
