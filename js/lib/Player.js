import {MCTS, Q_LEARNING, RANDOM, HUMAN} from "../constants/GameFixtures";
import MonteCarloTreeSearch from "./ai/mcts/MonteCarloTreeSearch";
import QLearning from "./ai/q-learning/QLearning";
import Random from "./ai/random/Random";
import Human from "./Human";

export default class Player {
  /**
   * Creates an instance of a player
   * @param player
   * @param callback
   * @returns {*}
   */
  static create(player, callback) {
    let params = player.params;
    switch (player.algorithm) {
      case MCTS:
        return callback(new MonteCarloTreeSearch(params.id));
      case Q_LEARNING:
        let qLearning = new QLearning(params);
        return qLearning.initData(() => callback(qLearning));
      case RANDOM:
        return callback(new Random(params.id));
      case HUMAN:
        return callback(new Human(params.id));
      default:
        return callback(new Random(params.id));
    }
  }
}
