import React, {Component, PropTypes} from "react";
import Input from '../form/Input';
import CheckboxWrapped from '../form/CheckboxWrapped';
import {DEFAULT_MAX_DEPTH} from "../../constants/GameFixtures";


class MCTSParams extends Component {
  render() {
    const {} = this.props;

    return (
      <div className="mcts-params">
        <Input id="max-depth" name="maxDepth" label="Turns Per Action" inputProps={{defaultValue: DEFAULT_MAX_DEPTH}}/>
      </div>
    )
  }
}

MCTSParams.propTypes = {};

export default MCTSParams;