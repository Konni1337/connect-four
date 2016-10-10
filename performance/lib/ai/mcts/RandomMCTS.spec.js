import * as P from '../../../performanceHelper';
import RandomMCTS from "../../../../js/lib/ai/mcts/RandomMCTS";
import Game from "../../../../js/lib/Game";


describe('Performance', () => {
  describe('RandomMCTS', () => {

    let game = new Game('test', 4, 4);
    P.perf('playUntilFinished 4x4', () => RandomMCTS.playUntilFinished(game));

    game = new Game('test', 5, 5);
    P.perf('playUntilFinished 5x5', () => RandomMCTS.playUntilFinished(game));

    game = new Game('test', 6, 6);
    P.perf('playUntilFinished 6x6', () => RandomMCTS.playUntilFinished(game));

    game = new Game('test', 7, 7);
    P.perf('playUntilFinished 7x7', () => RandomMCTS.playUntilFinished(game));
  });
});
