import React, {Component, PropTypes} from "react";
import QLearningParams from './QLearningParams';
import SelectWrapped from '../form/SelectWrapped';
import HumanParams from './HumanParams';
import MCTSParams from './MCTSParams';
import RandomParams from './RandomParams';
import {Q_LEARNING, MCTS, HUMAN, RANDOM} from "../../constants/GameFixtures";

class PlayerInputs extends Component {
  render() {
    const {title, isTraining} = this.props;
    const options = [Q_LEARNING, MCTS, RANDOM];
    if (!isTraining) options.push(HUMAN);

    return (
      <div className="form-horizontal">
        <h3>{title}</h3>
        <SelectWrapped name="algorithm" values={options}>
          <QLearningParams/>
          <MCTSParams/>
          <RandomParams />
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