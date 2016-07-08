import StateAction from "./StateAction";
import StateActionValue from "./StateActionValue";
import {DRAW} from "../../../constants/GameFixtures";
import {getRandomElement} from "../../../helpers/commonHelper";

function calcAlpha(self) {
  return self.dynamicAlpha ? self.alpha_0 * Math.pow(0.5, self.experience.episodes / self.e_2) : self.alpha_0;
}

/**
 * This is a Q-Learning AI for the game connect four
 */
export default class QLearning {
  id = null;

  constructor(params) {
    this.id = params.id;
    this.rewards = params.rewards;
    this.experience = params.experience;
    this.alpha_0 = params.alpha_0;
    this.gamma = params.gamma;
    this.epsilon = params.epsilon;
    this.dynamicAlpha = params.dynamicAlpha;
    this.e_2 = params.e_2;
    this.alpha = calcAlpha(this);
    this.lastStateActionValue = null;
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
    this.experience.bestStateActionValue(state, possibleActions, callback)
  }

  /**
   * Selects the best action
   * 
   * @param game
   * @param callback
   */
  selectAction(game, callback) {
    let reward = 0;
    let state = game.grid;
    let possibleActions = game.getValidMoves();
    let self = this;
    this.experience.bestStateActionValue(state, possibleActions, (err, bestStateActionValue) => {
      if (err) throw err;
      // If this isn't the first state, then apply TD-Update
      if (self.lastStateActionValue != null) {
        let tdError = reward + self.gamma * bestStateActionValue.value - self.lastStateActionValue.value;
        let value = parseFloat(self.lastStateActionValue.value) + self.alpha * tdError;
        this.experience.set(self.lastStateActionValue.stateAction, value, (err) => {
          if (err) throw err;
          self.applyEpsilonGreedy(bestStateActionValue, possibleActions, self, (stateActionValue) => {
            self.lastStateActionValue = stateActionValue;
            callback(stateActionValue.stateAction.action);
          });
        });
      } else {
        self.applyEpsilonGreedy(bestStateActionValue, possibleActions, self, (stateActionValue) => {
          self.lastStateActionValue = stateActionValue;
          callback(stateActionValue.stateAction.action);
        });
      }
    });
  }

  /**
   * A hook that is called when the game ends. Sets the final reward.
   *
   * @param result
   */
  endGame(result) {
    let self = this;
    let reward = result === DRAW ? this.rewards.draw : result === this.id ? this.rewards.won : this.rewards.lost;
    let value = parseFloat(this.lastStateActionValue.value + this.alpha * (reward - this.lastStateActionValue.value));

    this.experience.set(this.lastStateActionValue.stateAction, value, (err) => {
      if (err) throw err;
      self.lastStateActionValue = null;
      self.experience.episodes += 1;
      self.alpha = calcAlpha(self);
    });
  }

  /** This method selects an Action entry according to the epsilon greedy policy.
   *
   *  @param bestStateActionValue the currently selected best state action value
   *  @param possibleActions all possible actions in the current state
   *  @param self QLearning instance
    * @param callback function
   *
   * @return action if exploration occurred then a random action otherwise the bestAction
   */
  applyEpsilonGreedy(bestStateActionValue, possibleActions, self, callback) {
    if (Math.random() < this.epsilon) {
      let action = getRandomElement(possibleActions);
      if (!action) debugger;
      let state = bestStateActionValue.stateAction.state;
      let stateAction = new StateAction(state, action);
      self.experience.get(stateAction, (err, value) => {
        if (err) throw err;
        callback(new StateActionValue(stateAction, value))
      });
    } else {
      callback(bestStateActionValue)
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
}

