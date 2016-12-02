import React, {Component, PropTypes} from "react";
import Input from '../form/Input';
import CheckboxWrapped from '../form/CheckboxWrapped';
import {DEFAULT_MAX_DEPTH} from "../../constants/GameFixtures";


class MCTSParams extends Component {
  render() {
    const {} = this.props;

    return (
      <div className="mcts-params">
        <hr style={{position: 'absolute', left: '10%', width: '80%'}} />
        <div style={{paddingTop: '55px'}}></div>
        <Input id="id" name="id" label="Id" inputProps={{defaultValue: "MCTS"}}/>
        <Input id="max-depth" name="maxDepth" label="Turns Per Action" inputProps={{defaultValue: DEFAULT_MAX_DEPTH}}/>
        <hr style={{position: 'absolute', left: '10%', width: '80%'}} />
        <div style={{paddingTop: '55px'}}></div>
      </div>
    )
  }
}

MCTSParams.propTypes = {};

export default MCTSParams;
