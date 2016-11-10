import React, {Component, PropTypes} from "react";
import Input from '../form/Input';
import CheckboxWrapped from '../form/CheckboxWrapped';


class QLearningParams extends Component {
  render() {
    return (
      <div className="q-learning-params">
        <Input id="db" name="db" label="Database-Id" inputProps={{defaultValue: "q1"}}/>
        <Input id="gamma" name="gamma" label="Gamma" inputProps={{defaultValue: 1.0, type: 'number'}}/>
        <Input id="epsilon" name="epsilon" label="Epsilon" inputProps={{defaultValue: 0.001, type: 'number'}}/>
        <Input id="alpha" name="alpha" label="Alpha" inputProps={{defaultValue: 0.5, type: 'number'}}/>
        <CheckboxWrapped id="dynamic-alpha" name="dynamic-alpha" label="Dynamic Alpha">
          <Input id="e2" name="e2" label="E2" inputProps={{defaultValue: 3.0, type: 'number'}}/>
        </CheckboxWrapped>
      </div>
    )
  }
}

export default QLearningParams;