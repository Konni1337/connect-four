import StateAction from "./StateAction";
import StateActionValue from "./StateActionValue";
import {DRAW} from "../../../constants/GameFixtures";
import {getRandomElement} from "../../../helpers/CommonHelper";
import QLearningParams from './QLearningParams';
import winston from "winston";

/**
 * This is a Q-Learning AI for the game connect four
 */
export default class QLearning {
  id = null;

  constructor(params) {
    let defaultParams = new QLearningParams(params.id);
    this.id = params.id;
    this.playerId = params.playerId;
    this.rewards = params.rewards || defaultParams.rewards;
    this.experience = params.experience || defaultParams.experience;
    this.alpha_0 = params.alpha_0 || defaultParams.alpha_0;
    this.gamma = params.gamma || defaultParams.gamma;
    this.epsilon = params.epsilon || defaultParams.epsilon;
    this.dynamicAlpha = params.dynamicAlpha || defaultParams.dynamicAlpha;
    this.e_2 = params.e_2 || defaultParams.e_2;
    this.lastStateActionValue = null;
  }

  clone() {
    return new QLearning({
      id: this.id,
      rewards: this.rewards,
      experience: this.experience,
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


  /** This method returns best known action in the given state out of the possible actions
   *
   *  @param state the current state the agent is in
   *  @param possibleActions a list of possible actions
   *  @param callback function
   *
   *  @return StateActionValue which contains the best action, the current state and the
   *          Q-Value of the best action
   */
  bestStateActionValue(state, possibleActions, callback) {
    var self = this;
    self.experience.bestStateActionValue(state, possibleActions, (bestStateActionValue) => {
      if (self.lastStateActionValue) {
        let oldValue = self.lastStateActionValue.value;
        let newValue = oldValue + self.alpha * (self.gamma * bestStateActionValue.value - oldValue);
        self.experience.setValue(self.lastStateActionValue.stateAction, newValue, () => callback(bestStateActionValue));
      } else {
        callback(bestStateActionValue)
      }
    });
  }

  /**
   * Selects the best action
   *
   * @param game
   * @param callback
   */
  selectAction(game, callback) {
    let self = this;
    let possibleActions = game.getValidMoves();
    let state = game.grid.map(col => col.slice(0));
    self.ensureInit(() => {
      self.bestStateActionValue(state, possibleActions, (bestStateActionValue) => {
        self.applyEpsilonGreedy(bestStateActionValue, possibleActions, (action) => {
          callback(action)
        });
      })
    });
  }

  ensureInit(callback) {
    var self = this;
    if (!self.episodes || !self.alpha) {
      self.experience.get('episodes', (err, episodes) => {
        if (err) episodes = 0;
        self.episodes = parseInt(episodes);
        self.alpha = self.calcAlpha();
        callback()
      });
    } else {
      callback()
    }
  }

  /**
   * A hook that is called when the game ends. Sets the final reward.
   *
   * @param result
   * @param callback
   */
  endGame(result, callback) {
    let self = this;
    let oldValue = self.lastStateActionValue.value,
      oldStateAction = self.lastStateActionValue.stateAction,
      reward = result === DRAW ? self.rewards.draw : result === self.playerId ? self.rewards.won : self.rewards.lost,
      newValue = oldValue + self.alpha * (reward - oldValue);
    self.experience.setValue(oldStateAction, newValue, () => {
      self.lastStateActionValue = null;
      self.alpha = self.calcAlpha();
      self.episodes += 1;
      self.experience.set('episodes', self.episodes, () => {
        callback(result)
      });
    });
  }

  /** This method selects an Action entry according to the epsilon greedy policy.
   *
   *  @param bestStateActionValue the currently selected best state action summedValue
   *  @param possibleActions all possible actions in the current state
   * @param callback function
   *
   * @return action if exploration occurred then a random action otherwise the bestAction
   */
  applyEpsilonGreedy(bestStateActionValue, possibleActions, callback) {
    var self = this;
    if (Math.random() < self.epsilon) {
      let stateAction = new StateAction(bestStateActionValue.stateAction.state, getRandomElement(possibleActions));
      self.experience.getValue(stateAction, value => {
        self.lastStateActionValue = new StateActionValue(stateAction, value);
        callback(self.lastStateActionValue.stateAction.action);
      });
    } else {
      self.lastStateActionValue = bestStateActionValue;
      callback(bestStateActionValue.stateAction.action);
    }
  }

  /**
   * Returns false
   *
   * @returns {boolean}
   */
  isHuman() {
    return false;
  }

  calcAlpha() {
    return this.dynamicAlpha ? this.alpha_0 * Math.pow(0.5, this.episodes / this.e_2) : this.alpha_0;
  }
}
