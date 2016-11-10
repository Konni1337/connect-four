import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import * as StepActions from "../../actions/StepActions";
import GridForm from './GridForm';
import PlayerForm from './PlayerForm';

class GameForm extends Component {
  render() {
    const {step, changeStep, handleBack, handleSubmit} = this.props;

    return (
      <div>
        {step === 1 && <GridForm handleBack={handleBack} handleSubmit={() => changeStep(2)}/>}
        {step === 2 && <PlayerForm handleBack={() => changeStep(1)} handleSubmit={handleSubmit}/>}
      </div>
    )
  }
}

GameForm.propTypes = {
  handleBack: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired
};

export default connect(state => {
  return {
    step: state.steps.gameForm
  }
}, {
  changeStep: StepActions.changeGameFormStep
})(GameForm)
