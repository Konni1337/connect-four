import * as T from '../testHelper';
import Game from '../../js/lib/Game';
import {DRAW} from '../../js/constants/GameFixtures';

describe('Game', () => {
  describe('isFull', () => {
    it('should return true if grid is full', () => {
      const grid = [
        [1, 2, 2, 1],
        [1, 1, 1, 2],
        [2, 1, 1, 1],
        [2, 1, 2, 1]
      ];
      T.expect(Game.isFull(grid)).toBe(true)
    });

    it('should return false if grid is not full', () => {
      const grid = [
        [1, 2, 2, 1],
        [1, 1, 1, 2],
        [2, 1, 1, 0],
        [2, 1, 2, 1]
      ];
      T.expect(Game.isFull(grid)).toBe(false)
    });

    it('should return false if grid is empty', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      T.expect(Game.isFull(grid)).toBe(false)
    });
  });

  describe('makeAction', () => {
    it('should return false if grid is empty', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      const gridAfter = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      let action = {index: 2, player: 1};
      let game = new Game();
      game.grid = grid;
      T.expect(game.makeAction(action).grid).toEqual(gridAfter)
    });

    it('should execute the action', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      const gridAfter = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      let action = {index: 2, player: 1};
      let game = new Game();
      game.grid = grid;
      T.expect(game.makeAction(action).grid).toEqual(gridAfter)
    });

    it('should throw error if column is full', () => {
      const grid = [
        [0, 0, 0, 0],
        [1, 2, 2, 0],
        [0, 0, 0, 0],
        [1, 1, 2, 1]
      ];
      let action = {index: 3, player: 2};
      let game = new Game();
      game.grid = grid;
      T.expect(() => game.makeAction(action)).toThrow()
    });

    it('should not change isFinished if no one finished', () => {
      const grid = [
        [0, 0, 0, 0],
        [1, 2, 0, 0],
        [1, 2, 0, 0],
        [1, 2, 0, 0]
      ];
      let action = {index: 3, player: 1};
      let game = new Game();
      game.grid = grid;
      T.expect(game.makeAction(action).isFinished).toBe(false)
    });

    it('should change isFinished to true if the action finishes the game', () => {
      const grid = [
        [0, 0, 0, 0],
        [1, 2, 0, 0],
        [1, 2, 0, 0],
        [1, 2, 0, 0]
      ];
      let action = {index: 0, player: 1};
      let game = new Game();
      game.grid = grid;
      T.expect(game.makeAction(action).isFinished).toBe(true)
    });

    it('should set result if with the action a player wins', () => {
      const grid = [
        [2, 1, 2, 1],
        [1, 2, 1, 0],
        [1, 2, 2, 1],
        [1, 1, 2, 1]
      ];
      let action = {index: 1, player: 1};
      let game = new Game();
      game.grid = grid;
      T.expect(game.makeAction(action).result).toBe(1)
    });

    it('should set result to draw if grid is full and no one wins', () => {
      const grid = [
        [2, 1, 2, 1],
        [1, 2, 1, 0],
        [1, 2, 2, 1],
        [1, 1, 2, 1]
      ];
      let action = {index: 1, player: 2};
      let game = new Game();
      game.grid = grid;
      T.expect(game.makeAction(action).result).toBe(DRAW)
    });
  });

  describe('getValidActions', () => {
    it('should return all column indices for player 1 if grid is empty', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      const validActions = [
        {index: 0, player: 1},
        {index: 1, player: 1},
        {index: 2, player: 1},
        {index: 3, player: 1}
      ];
      let game = new Game();
      game.grid = grid;
      T.expect(game.getValidActions()).toEqual(validActions)
    });

    it('should return all column indices for player 2 if grid is empty and current player is 2', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      const validActions = [
        {index: 0, player: 2},
        {index: 1, player: 2},
        {index: 2, player: 2},
        {index: 3, player: 2}
      ];
      let game = new Game();
      game.currentPlayer = 2;
      game.grid = grid;
      T.expect(game.getValidActions()).toEqual(validActions)
    });

    it('should return only column indices for columns that have space', () => {
      const grid = [
        [0, 0, 0, 0],
        [1, 1, 2, 1],
        [0, 0, 0, 0],
        [2, 1, 2, 0]
      ];
      const validActions = [
        {index: 0, player: 1},
        {index: 2, player: 1},
        {index: 3, player: 1}
      ];
      let game = new Game();
      game.grid = grid;
      T.expect(game.getValidActions()).toEqual(validActions)
    });

    it('should return only column indices for columns that have space for player 2 if current player is 2', () => {
      const grid = [
        [0, 0, 0, 0],
        [1, 1, 2, 1],
        [0, 0, 0, 0],
        [2, 1, 2, 2]
      ];
      const validActions = [
        {index: 0, player: 2},
        {index: 2, player: 2}
      ];
      let game = new Game();
      game.currentPlayer = 2;
      game.grid = grid;
      T.expect(game.getValidActions()).toEqual(validActions)
    });

    it('should return empty array if grid is full', () => {
      const grid = [
        [1, 1, 2, 1],
        [1, 1, 2, 1],
        [1, 2, 1, 1],
        [2, 1, 2, 2]
      ];
      let game = new Game();
      game.currentPlayer = 2;
      game.grid = grid;
      T.expect(game.getValidActions()).toEqual([])
    });
  });

  describe('clone', () => {
    it('should return a copy of the game', () => {
      let game = new Game(1);
      T.expect(game.clone()).toEqual(game);
    });

    it('should not return the same instance of the game', () => {
      let game = new Game();
      T.expect(game.clone()).toNotBe(game);
    });
  });

  describe('findResult', () => {
    it('should return -1 if there is no player with four in a row', () => {
      const grid = [
        [1, 2, 0, 0],
        [1, 1, 1, 0],
        [2, 1, 1, 1],
        [2, 1, 2, 0]
      ];
      T.expect(Game.findResult(grid)).toEqual(-1)
    });

    it('should return DRAW if grid is full and no winner', () => {
      const grid = [
        [2, 2, 1, 1],
        [1, 1, 1, 2],
        [2, 2, 1, 2],
        [1, 1, 2, 2]
      ];
      T.expect(Game.findResult(grid)).toEqual(DRAW)
    });

    it('should return 1 if there are 4 in a row down right', () => {
      const grid = [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [2, 2, 1, 2],
        [1, 1, 2, 1]
      ];
      T.expect(Game.findResult(grid)).toEqual(1)
    });

    it('should return 2 if there are 4 in a row down right', () => {
      const grid = [
        [2, 0, 0, 0],
        [1, 2, 1, 2],
        [2, 1, 2, 2],
        [2, 1, 2, 2]
      ];
      T.expect(Game.findResult(grid)).toEqual(2)
    });

    it('should return 1 if there are 4 in a row up right', () => {
      const grid = [
        [1, 2, 2, 2],
        [2, 1, 1, 0],
        [2, 1, 1, 0],
        [1, 1, 2, 1]
      ];
      T.expect(Game.findResult(grid)).toEqual(1)
    });

    it('should return 2 if there are 4 in a row up right', () => {
      const grid = [
        [2, 0, 0, 0],
        [1, 2, 2, 2],
        [2, 2, 2, 1],
        [2, 1, 2, 2]
      ];
      T.expect(Game.findResult(grid)).toEqual(2)
    });

    it('should return 1 if there are 4 in a row right', () => {
      const grid = [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 2, 2, 1],
        [1, 1, 2, 1]
      ];
      T.expect(Game.findResult(grid)).toEqual(1)
    });

    it('should return 1 if there are 4 in a row right', () => {
      const grid = [
        [2, 2, 1, 1],
        [1, 2, 1, 1],
        [2, 2, 2, 1],
        [1, 1, 2, 1]
      ];
      T.expect(Game.findResult(grid)).toEqual(1)
    });

    it('should return 2 if there are 4 in a row right', () => {
      const grid = [
        [2, 1, 1, 2],
        [2, 1, 2, 2],
        [1, 2, 2, 2],
        [1, 1, 2, 2]
      ];
      T.expect(Game.findResult(grid)).toEqual(2)
    });

    it('should return 1 if there are 4 in a row down', () => {
      const grid = [
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [1, 1, 2, 2],
        [1, 1, 1, 1]
      ];
      T.expect(Game.findResult(grid)).toEqual(1)
    });

    it('should return 1 if there are 4 in a row down', () => {
      const grid = [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 2, 2, 0]
      ];
      T.expect(Game.findResult(grid)).toEqual(1)
    });

    it('should return 2 if there are 4 in a row down', () => {
      const grid = [
        [2, 2, 2, 2],
        [2, 1, 2, 1],
        [1, 1, 1, 2],
        [1, 1, 2, 2]
      ];
      T.expect(Game.findResult(grid)).toEqual(2)
    });
  });
});
