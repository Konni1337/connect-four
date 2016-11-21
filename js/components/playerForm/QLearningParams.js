import React, {Component, PropTypes} from "react";
import Input from '../form/Input';
import CheckboxWrapped from '../form/CheckboxWrapped';
import {Q_LEARNING_CONFIG} from "../../constants/GameFixtures";


class QLearningParams extends Component {
  render() {
    return (
      <div className="q-learning-params">
        <Input id="db" name="db" label="Database-Id" inputProps={{defaultValue: "q1"}}/>
        <Input id="gamma" name="gamma" label="Gamma" inputProps={{defaultValue: Q_LEARNING_CONFIG.DEFAULT_GAMMA}}/>
        <Input id="epsilon" name="epsilon" label="Epsilon"
               inputProps={{defaultValue: Q_LEARNING_CONFIG.DEFAULT_EPSILON}}/>
        <Input id="alpha" name="alpha" label="Alpha" inputProps={{defaultValue: Q_LEARNING_CONFIG.DEFAULT_ALPHA_0}}/>
        <CheckboxWrapped id="dynamic-alpha" name="dynamic-alpha" label="Dynamic Alpha">
          <Input id="e2" name="e2" label="E2" inputProps={{defaultValue: Q_LEARNING_CONFIG.DEFAULT_E_2}}/>
        </CheckboxWrapped>
      </div>
    )
  }
}

export default QLearningParams;
