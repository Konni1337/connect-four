import {Q_LEARNING_CONFIG as config} from '../../../constants/GameFixtures'
import Experience from "./Experience";

/**
 * This class represents a config for the Q-Learning AI
 */
export default class QLearningParams {
  id = null;
  rewards = config.DEFAULT_REWARDS;
  experience = new Experience(config.DEFAULT_EXPERIENCE);
  alpha_0 = config.DEFAULT_ALPHA_0;
  gamma = config.DEFAULT_GAMMA;
  epsilon = config.DEFAULT_EPSILON;
  dynamicAlpha = config.DEFAULT_DYNAMIC_ALPHA;
  e_2 = config.DEFAULT_E_2;

  constructor(id, overrides = {}) {
    this.id = id;
    if (overrides.rewards) this.rewards = overrides.rewards;
    if (overrides.experience) this.experience = overrides.experience;
    if (overrides.alpha_0) this.alpha_0 = overrides.alpha;
    if (overrides.gamma) this.gamma = overrides.gamma;
    if (overrides.epsilon) this.epsilon = overrides.epsilon;
    if (overrides.dynamicAlpha) this.dynamicAlpha = overrides.dynamicAlpha;
    if (overrides.e_2) this.e_2 = overrides.e_2;
  }
}