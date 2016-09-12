import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import GameStart from "./GameStart";
import GamePlay from "./GamePlay";
import Training from "./TrainingContainer";
import * as GameFixtures from '../constants/GameFixtures';
import ErrorContainer from "./ErrorContainer";

class GameContainer extends Component {
  static propTypes = {
    isStarted: PropTypes.bool.isRequired,
    gameType: PropTypes.string.isRequired
  };

  render() {
    const {isStarted, gameType} = this.props;
    return (
      <div>
        <ErrorContainer />
        {!isStarted && <GameStart />}
        {isStarted && gameType === GameFixtures.GAME_TYPE_NORMAL && <GamePlay />}
        {isStarted && gameType === GameFixtures.GAME_TYPE_TRAINING && <Training />}
      </div>
    )
  }
}

export default connect(state => {
  return {
    isStarted: state.isStarted,
    gameType: state.gameType
  }
}, {})(GameContainer)
