import {MCTS, Q_LEARNING, RANDOM, HUMAN} from "../constants/GameFixtures";
import MonteCarloTreeSearch from "./ai/mcts/MonteCarloTreeSearch";
import QLearning from "./ai/q-learning/QLearning";
import Random from "./ai/random/Random";
import Human from "./Human";

export default class Player {
  /**
   * Creates an instance of a player
   * @param player
   * @param isTraining
   * @returns {*}
   */
  static create(player, isTraining = false) {
    let params = player.params;
    switch (player.algorithm) {
      case MCTS:
        return new MonteCarloTreeSearch(params.id);
      case Q_LEARNING:
        return new QLearning(params, isTraining); // new QLearningParams(id, params {experience: new Experience(id)})
      case RANDOM:
        return new Random(params.id);
      case HUMAN:
        return new Human(params.id);
      default:
        return new Random(params.id);
    }
  }
}
