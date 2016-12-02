import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import uuid from 'node-uuid';
import * as PlayerActions from "../../actions/PlayerActions";
import * as StepActions from "../../actions/StepActions";
import PlayerInputs from '../../components/playerForm/PlayerInputs'

class GameStart extends Component {
  onBackClick(event, fn) {
    event.preventDefault();
    fn()
  }

  submitForm(event) {
    event.preventDefault();
    const {step, changePlayer, changeStep} = this.props;

    let formData = new FormData(event.target),
      playerObject = {playerId: step};

    for (var pair of formData.entries()) {
      playerObject[pair[0]] = pair[1];
    }

    changePlayer(playerObject, step);
    changeStep(step + 1);
  }

  render() {
    const {step, changeStep, isTraining, handleBack, handleSubmit} = this.props;
    return (
      <div>
        {step === 1 &&
        <form className="form-horizontal small-form" onSubmit={this.submitForm.bind(this)}>
          <PlayerInputs title="Player 1" isTraining={isTraining}/>
          <div className="form-controls">
            <button className="btn btn-default" onClick={event => this.onBackClick(event, handleBack)}>
              Back
            </button>
            <button className="btn btn-primary" type="submit">Next</button>
          </div>
        </form>}
        {step === 2 &&
        <form className="form-horizontal small-form" onSubmit={this.submitForm.bind(this)}>
          <PlayerInputs title="Player 2" isTraining={isTraining}/>
          <div className="form-controls">
            <button className="btn btn-default" onClick={event => this.onBackClick(event, () => changeStep(1))}>
              Back
            </button>
            <button className="btn btn-primary" type="submit">Next</button>
          </div>
        </form>}
        {step === 3 &&
        <div className="form-controls">
          <button className="btn btn-default" onClick={() => changeStep(2)}>
            Back
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>Start Game</button>
        </div>}
      </div>
    )
  }
}

GameStart.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired
};

export default connect(state => {
  return {
    isTraining: (state.steps.menu === 2),
    step: state.steps.playerForm
  }
}, {
  changePlayer: PlayerActions.changePlayer,
  changeStep: StepActions.changePlayerFormStep
})(GameStart)
