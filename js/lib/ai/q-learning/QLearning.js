import {getRandomElement} from "../../../helpers/CommonHelper";
import dbLayer from "../dbLayer/dbLayer";
import {STATISTICS_DB_PREFIX} from "../../../constants/config";
import stateToString, {stateActionString} from "../dbLayer/stateToKeyString";
import Experience from "./Experience";
import {Q_LEARNING_CONFIG as defaults, DRAW} from "../../../constants/GameFixtures";

/**
 * This is a Q-Learning AI for the game connect four
 */
export default class QLearning {
  id = null;

  constructor(params) {
    this.id = params.id;
    this.playerId = params.playerId;
    this.rewards = params.rewards || defaults.DEFAULT_REWARDS;
    this.experience = new Experience(this.id);
    this.alpha_0 = params.alpha_0 || defaults.DEFAULT_ALPHA_0;
    this.gamma = params.gamma || defaults.DEFAULT_GAMMA;
    this.epsilon = params.epsilon || defaults.DEFAULT_EPSILON;
    this.dynamicAlpha = params.dynamicAlpha || defaults.DEFAULT_DYNAMIC_ALPHA;
    this.e_2 = params.e_2 || defaults.DEFAULT_E_2;
    this.statisticsDb = dbLayer.getDatabase(STATISTICS_DB_PREFIX + this.id);
    this.lastStateActionValue = null;


  }

  initData(callback) {
    let self = this;
    self.experience.get('episodes', (err, episodes) => {
      if (err) episodes = 0;
      self.episodes = parseInt(episodes);
      self.alpha = this.calcAlpha();
      console.log('loaded initial data for qLearning ' + self.id + ' with ' + self.episodes + ' episodes;');
      callback()
    });
  }

  clone() {
    return new QLearning({
      id: this.id,
      rewards: this.rewards,
      experience: this.experience,
      statisticsDb: this.statisticsDb,
      alpha_0: this.alpha_0,
      gamma: this.gamma,
      epsilon: this.epsilon,
      dynamicAlpha: this.dynamicAlpha,
      e_2: this.e_2,
      episodes: this.episodes,
      alpha: this.alpha,
      lastStateActionValue: this.lastStateActionValue
    })
  }

  /**
   * Updates the lastStateActionValue
   *
   * @param bestValue
   * @param callback
   * @returns {*}
   */
  updateQValue(bestValue, callback) {
    if (!this.lastStateActionValue) return callback();

    let {state, action, value} = this.lastStateActionValue;

    this.experience.setQValue(stateActionString(state, action), this.calcQValue(value, bestValue), callback);
  }

  /**
   * Calculates the new QValue
   *
   * @param oldValue
   * @param bestValue
   * @param reward
   * @returns {*}
   */
  calcQValue(oldValue, bestValue, reward = 0) {
    return oldValue + this.alpha * (reward + this.gamma * bestValue - oldValue);
  }


  /**
   * Selects the best action
   *
   * @param game
   * @param callback
   */
  selectAction(game, callback) {
    let self = this,
      possibleActions = game.getValidMoves(),
      state = stateToString(game.grid);

    self.experience.bestStateActionValue(state, possibleActions, ({state, action, value}) => {
      self.updateQValue(value, () => {
        // apply epsilon greedy
        if (Math.random() < self.epsilon) {
          let newAction = getRandomElement(possibleActions);
          self.experience.getQValue(stateActionString(state, newAction), newValue => {
            self.lastStateActionValue = {state, action: newAction, value: newValue};
            callback(newAction);
          });
        } else {
          self.lastStateActionValue = {state, action, value};
          callback(action);
        }
      });
    });
  }

  /**
   * A hook that is called when the game ends. Sets the final reward.
   *
   * @param result
   * @param callback
   */
  endGame(result, callback) {
    let self = this,
      {state, action, value} = self.lastStateActionValue,
      newValue = self.calcQValue(value, 0, self.getReward(result));

    self.experience.setQValue(stateActionString(state, action), newValue, () => {
      self.lastStateActionValue = null;
      self.alpha = self.calcAlpha();
      self.episodes += 1;
      self.experience.set('episodes', self.episodes, () => {
        self.statisticsDb.put(self.episodes, result, () => callback(result))
      });
    });
  }

  /**
   * Returns false
   *
   * @returns {boolean}
   */
  isHuman() {
    return false;
  }

  /**
   * Returns the reward depending on the result
   * @param result
   * @returns {*}
   */
  getReward(result) {
    switch (result) {
      case DRAW:
        return this.rewards.draw;
      case this.playerId:
        return this.rewards.won;
      default:
        return this.rewards.lost;
    }
  }

  /**
   * Calculates the new alpha value
   *
   * @returns {*}
   */
  calcAlpha() {
    return this.dynamicAlpha ? this.alpha_0 * Math.pow(0.5, this.episodes / this.e_2) : this.alpha_0;
  }
}
