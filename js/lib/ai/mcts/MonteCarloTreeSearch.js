import Root from "./Root";
import {
  BEST_FIRST_ACTION,
  STATISTICS_DB_PREFIX,
  EPISODES_NEEDED_FOR_STATISTICS_UPDATE,
  MCTS_DB_PREFIX
} from "../../../constants/config";
import stateToString from "../../dbLayer/stateToKeyString";
import dbLayer from "../../dbLayer/dbLayer";
import {DRAW} from "../../../constants/GameFixtures";

/**
 * A game AI that uses Monte Carlo Tree Search to find the best action
 */
export default class MonteCarloTreeSearch {
  constructor(params = {}) {
    this.id = params.id;
    this.playerId = params.playerId;
    this.maxIterations = params.maxIterations || 100;
    this.episodes = 0;
    this.wins = 0;
    this.draws = 0;
    this.db = dbLayer.getDatabase([MCTS_DB_PREFIX, this.id].join('-'));
    this.statisticsDb = dbLayer.getDatabase([STATISTICS_DB_PREFIX, this.id, this.playerId].join('-'));
  }

  initData(callback) {
    let self = this;

    self.db.get('episodes', (err, json) => {
      if (err) {
        self.episodes = 0;
        self.wins = 0;
        self.draws = 0;
      } else {
        let data = JSON.parse(json);
        self.episodes = parseInt(data.episodes || 0);
        self.wins = parseInt(data.wins || 0);
        self.draws = parseInt(data.draws || 0);
      }

      console.log('loaded initial data for mcts ' + self.id + ' with ' + self.episodes + ' episodes;');
      callback()
    });
  }

  clone() {
    return new MonteCarloTreeSearch(this.id, this.playerId, this.maxIterations)
  }

  /**
   * Finds the best action by MCTS
   *
   * @param game    instance of the game
   * @param cb      callback
   */
  selectAction(game, cb) {
    if (BEST_FIRST_ACTION && parseInt(stateToString(game.grid)) === 0 && game.grid.length === 7) {
      return cb({index: 3, player: this.playerId});
    }
    cb(this.selectActionSync(game))
  }

  /**
   * Finds the best action by MCTS
   *
   * @param game    instance of the game
   */
  selectActionSync(game) {
    return new Root(game).exploreAndFind(this.maxIterations);
  }

  /**
   * A hook that is called when a game is finished
   */
  endGame(result, callback) {
    let self = this;

    self.episodes += 1;
    if (result === self.playerId) self.wins += 1;
    if (result === DRAW) self.draws += 1;

    const data = JSON.stringify({episodes: self.episodes, wins: self.wins, draws: self.draws});

    self.db.put('episodes', data, () => {
      if (self.episodes % EPISODES_NEEDED_FOR_STATISTICS_UPDATE === 0) {
        const statisticsData = JSON.stringify({wins: self.wins, draws: self.draws});
        self.statisticsDb.put(self.episodes, statisticsData, () => callback(result))
      } else {
        callback(result)
      }
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
}
