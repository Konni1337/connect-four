import {Q_LEARNING_CONFIG as config} from '../../../constants/GameFixtures'
import Experience from "./Experience";

/**
 * This class represents a config for the Q-Learning AI
 */
export default class QLearningParams {
  id = null;
  experience = null;
  rewards = config.DEFAULT_REWARDS;
  alpha_0 = config.DEFAULT_ALPHA_0;
  gamma = config.DEFAULT_GAMMA;
  epsilon = config.DEFAULT_EPSILON;
  dynamicAlpha = config.DEFAULT_DYNAMIC_ALPHA;
  e_2 = config.DEFAULT_E_2;

  constructor(id) {
    this.id = id;
    this.experience = new Experience(id);
  }
}
