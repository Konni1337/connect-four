import * as P from '../../../performanceHelper';
import MonteCarloTreeSearch from "../../../../js/lib/ai/mcts/MonteCarloTreeSearch";
import Game from "../../../../js/lib/Game";


describe('Performance', () => {
  describe('MonteCarloTreeSearch 1000', () => {
    let mcts = new MonteCarloTreeSearch('test', 1000);

    let game = new Game('test', 4, 4);
    P.perf('MCTS1000selectAction4x4', () => mcts.selectActionSync(game));

    game = new Game('test', 5, 5);
    P.perf('MCTS1000selectAction5x5', () => mcts.selectActionSync(game));

    game = new Game('test', 6, 6);
    P.perf('MCTS1000selectAction6x6', () => mcts.selectActionSync(game));

    game = new Game('test', 7, 7);
    P.perf('MCTS1000selectAction7x7', () => mcts.selectActionSync(game));
  });
});