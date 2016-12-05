import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import * as StepActions from "../../actions/StepActions";
import * as TrainingsActions from "../../actions/TrainingsActions";
import Input from '../../components/form/Input';
import GridForm from './GridForm';
import PlayerForm from './PlayerForm';

class TrainingsForm extends Component {
  iterationsSubmit(event) {
    event.preventDefault();
    const {changeStep} = this.props;
    changeStep(2);
  }

  render() {
    const {step, changeStep, handleSubmit, changeIterations, iterations} = this.props;

    return (
      <div>
        {step === 1 && <form onSubmit={this.iterationsSubmit.bind(this)}>
          <Input id="iterations" label="Iterations" name='iterations'
                 inputProps={{onChange: changeIterations, value: iterations, type: 'number'}}/>
          <div className="form-controls">
            <button className="btn btn-primary" type="submit">Next</button>
          </div>
        </form>}
        {step === 2 && <GridForm handleBack={() => changeStep(1)} handleSubmit={() => changeStep(3)}/>}
        {step === 3 && <PlayerForm handleBack={() => changeStep(2)} handleSubmit={handleSubmit}/>}
      </div>
    )
  }
}

TrainingsForm.propTypes = {
  handleBack: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired
};

export default connect(state => {
  return {
    step: state.steps.trainingsForm,
    iterations: state.training.iterations
  }
}, {
  changeIterations: TrainingsActions.changeIterations,
  changeStep: StepActions.changeTrainingsFormStep
})(TrainingsForm)
