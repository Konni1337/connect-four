import React, {Component, PropTypes} from "react";
import Input from '../form/Input';
import CheckboxWrapped from '../form/CheckboxWrapped';
import {Q_LEARNING_CONFIG} from "../../constants/GameFixtures";


class QLearningParams extends Component {
  render() {
    return (
      <div className="q-learning-params">
        <hr style={{position: 'absolute', left: '10%', width: '80%'}} />
        <div style={{paddingTop: '55px'}}></div>
        <Input id="id" name="id" label="Id" inputProps={{defaultValue: "Q-Learning2"}}/>
        <Input id="gamma" name="gamma" label="Gamma" inputProps={{defaultValue: Q_LEARNING_CONFIG.DEFAULT_GAMMA}}/>
        <Input id="epsilon" name="epsilon" label="Epsilon"
               inputProps={{defaultValue: Q_LEARNING_CONFIG.DEFAULT_EPSILON}}/>
        <Input id="alpha" name="alpha" label="Alpha" inputProps={{defaultValue: Q_LEARNING_CONFIG.DEFAULT_ALPHA}}/>
        <CheckboxWrapped id="dynamic-alpha" name="dynamic-alpha" label="Dynamic Alpha">
        </CheckboxWrapped>
        <hr style={{position: 'absolute', left: '10%', width: '80%'}} />
        <div style={{paddingTop: '55px'}}></div>
      </div>
    )
  }
}

export default QLearningParams;
