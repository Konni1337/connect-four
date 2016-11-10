import React, {Component, PropTypes} from "react";
import QLearningParams from './QLearningParams';
import SelectWrapped from '../form/SelectWrapped';
import HumanParams from './HumanParams';
import MCTSParams from './MCTSParams';
import {Q_LEARNING, MCTS, HUMAN} from "../../constants/GameFixtures";

class PlayerInputs extends Component {
  render() {
    const {title, isTraining} = this.props;
    const options = [Q_LEARNING, MCTS];
    if (!isTraining) options.push(HUMAN);

    return (
      <div className="form-horizontal">
        <h3>{title}</h3>
        <SelectWrapped name="algorithm" values={options}>
          <QLearningParams/>
          <MCTSParams/>
          {!isTraining && <HumanParams/>}
        </SelectWrapped>
      </div>
    )
  }
}

PlayerInputs.propTypes = {
  title: PropTypes.string.isRequired,
  isTraining: PropTypes.bool.isRequired
};

export default PlayerInputs;