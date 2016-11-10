import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import * as StepActions from "../actions/StepActions";

class Menu extends Component {
  handleChangeStep(nextStep) {
    const {isRunning, reset, changeStep} = this.props;
    if (isRunning) {
      reset();
      changeStep(nextStep);
    } else {
      changeStep(nextStep);
    }
  }

  render() {
    const {step} = this.props;

    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" onClick={() => this.handleChangeStep(0)} href="#">Connect Four AI</a>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li className={step === 1 ? 'active' : ''} onClick={() => this.handleChangeStep(1)}><a href="#">Play
                  Game</a></li>
                <li className={step === 2 ? 'active' : ''} onClick={() => this.handleChangeStep(2)}><a
                  href="#">Training</a></li>
                <li className={step === 3 ? 'active' : ''} onClick={() => this.handleChangeStep(3)}><a href="#">Statistics</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

Menu.propTypes = {};

export default connect(state => {
  return {
    step: state.steps.menu,
    isRunning: state.gameInfo.isRunning
  }
}, {
  reset: StepActions.reset,
  changeStep: StepActions.changeMenuStep
})(Menu)
