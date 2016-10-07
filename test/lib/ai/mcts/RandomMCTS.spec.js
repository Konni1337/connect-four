import Game from "../../../../js/lib/Game";
import RandomMCTS from "../../../../js/lib/ai/mcts/RandomMCTS";
import * as T from '../../../testHelper';
import {DRAW} from "../../../../js/constants/GameFixtures";


describe('RandomMCTS', () => {
  describe('findFinishMove', () => {
    it('should return a move with index -1 if the grid is empty and player is 1', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      T.expect(RandomMCTS.findFinishMove(grid, 1)).toEqual({index: -1, player: 1});
    });

    it('should return a move with index -1 if the grid is empty and player is 2', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      T.expect(RandomMCTS.findFinishMove(grid, 2)).toEqual({index: -1, player: 2});
    });

    it('should return a move with index -1 for player 1 if player 2 has three in a row', () => {
      const grid = [
        [1, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [2, 2, 2, 0]
      ];
      T.expect(RandomMCTS.findFinishMove(grid, 1)).toEqual({index: -1, player: 1});
    });

    it('should return a move with index -1 for player 1 if there are three in a row but its not finishable', () => {
      const grid = [
        [1, 2, 0, 0],
        [2, 2, 1, 0],
        [2, 1, 0, 0],
        [1, 0, 0, 0]
      ];
      T.expect(RandomMCTS.findFinishMove(grid, 1)).toEqual({index: -1, player: 1});
    });

    it('should return a move with index -1 for player 1 if there are three in a row but the forth is blocked', () => {
      const grid = [
        [1, 2, 1, 2],
        [2, 2, 1, 0],
        [2, 1, 0, 0],
        [1, 0, 0, 0]
      ];
      T.expect(RandomMCTS.findFinishMove(grid, 1)).toEqual({index: -1, player: 1});
    });

    it('should return a move with index -1 for player 2 if there are three in a row but its not finishable', () => {
      const grid = [
        [1, 2, 0, 0],
        [0, 0, 0, 0],
        [1, 2, 0, 0],
        [1, 2, 0, 0]
      ];
      T.expect(RandomMCTS.findFinishMove(grid, 2)).toEqual({index: -1, player: 2});
    });

    it('should return a move with index 3 for player 1 if there are three in a row', () => {
      const grid = [
        [1, 2, 0, 0],
        [1, 2, 0, 0],
        [1, 2, 0, 0],
        [0, 0, 0, 0]
      ];
      T.expect(RandomMCTS.findFinishMove(grid, 1)).toEqual({index: 3, player: 1});
    });

    it('should return a move with index 0 for player 2 if there are three in a row', () => {
      const grid = [
        [0, 0, 0, 0],
        [2, 1, 0, 0],
        [2, 1, 0, 0],
        [2, 1, 0, 0]
      ];
      T.expect(RandomMCTS.findFinishMove(grid, 2)).toEqual({index: 0, player: 2});
    });

    it('should return a move with index 0 for player 1 if there are three diagonal in a row ', () => {
      const grid = [
        [2, 2, 2, 0],
        [2, 1, 1, 0],
        [2, 1, 0, 0],
        [1, 1, 0, 0]
      ];
      T.expect(RandomMCTS.findFinishMove(grid, 1)).toEqual({index: 0, player: 1});
    });
  });

  describe('playUntilFinished', () => {
    it('should call findFinishMove at least 7 times', () => {
      for (let i = 0; i < 100; i++) {
        let spy = T.spyOn(RandomMCTS, 'findFinishMove').andCallThrough();
        RandomMCTS.playUntilFinished(new Game('test', 4, 4));
        T.expect(spy.calls.length).toBeGreaterThan(6); // 7 calls are the minimum moves to win
        spy.restore();
      }
    });

    it('should call findFinishMove at least 7 times', () => {
      for (let i = 0; i < 100; i++) {
        let spy = T.spyOn(RandomMCTS, 'findFinishMove').andCallThrough();
        RandomMCTS.playUntilFinished(new Game('test', 4, 4));
        T.expect(spy.calls.length).toBeGreaterThan(6); // 7 calls are the minimum moves to win
        spy.restore();
      }
    });

    it('should always return a valid result', () => {
      for (let i = 0; i < 100; i++) {
        let result = RandomMCTS.playUntilFinished(new Game('test', 4, 4));
        if (result === DRAW) {
          T.expect(result).toBe(DRAW);
        } else {
          T.expect(result).toBeGreaterThan(0).toBeLessThan(3);
        }
      }
    });
  });
});
