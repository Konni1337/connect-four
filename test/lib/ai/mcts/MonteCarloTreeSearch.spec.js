import * as T from '../../../testHelper';
import MonteCarloTreeSearch from "../../../../js/lib/ai/mcts/MonteCarloTreeSearch";

describe('MonteCarloTreeSearch', () => {
  describe('clone', () => {
    it('should return a new object with the same values', () => {
      let mcts = new MonteCarloTreeSearch(1);
      let mctsClone = mcts.clone();
      T.expect(mcts == mctsClone).toBe(false);
      T.expect(mcts.id === mctsClone.id && mcts.maxIterations === mctsClone.maxIterations).toBe(true)
    });
  });

  // describe('selectAction', () => {
  //   it('should return a new object with the same values', () => {
  //     let mcts = new MonteCarloTreeSearch(1, 1);
  //     let game = new Game();
  //     game.grid = [
  //       [0, 0, 0, 0],
  //       [0, 0, 0, 0],
  //       [0, 0, 0, 0],
  //       [0, 0, 0, 0]
  //     ];
  //     mcts.selectAction(game, action => {
  //
  //     })
  //     let mctsClone = mcts.clone();
  //     expect(mcts == mctsClone).toBe(false);
  //     expect(mcts.id === mctsClone.id && mcts.maxIterations === mctsClone.maxIterations).toBe(true)
  //   });
  // })
});
