import expect from "expect";
import Game from '../../js/lib/Game';
import {DRAW} from '../../js/constants/GameFixtures'

describe('result', () => {
  it('should return -1 if there is no player with four in a row', () => {
    let game = new Game();
    game.grid = [
      [0, 0, 1, 0],
      [0, 0, 1, 2],
      [0, 0, 1, 2],
      [1, 1, 2, 2]
    ];
    expect(game.findResult()).toEqual(-1)
  });

  it('should return DRAW if grid is full', () => {
    let game = new Game();
    game.grid = [
      [2, 2, 1, 1],
      [1, 1, 1, 2],
      [2, 2, 1, 2],
      [1, 1, 2, 2]
    ];
    expect(game.findResult()).toEqual(DRAW)
  });

  it('should return 1 if there are 4 in a row down right', () => {
    let game = new Game();
    game.grid = [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [2, 2, 1, 2],
      [1, 1, 2, 1]
    ];
    expect(game.findResult()).toEqual(1)
  });

  it('should return 2 if there are 4 in a row down right', () => {
    let game = new Game();
    game.grid = [
      [2, 0, 0, 0],
      [1, 2, 1, 2],
      [2, 1, 2, 2],
      [2, 1, 2, 2]
    ];
    expect(game.findResult()).toEqual(2)
  });

  it('should return 1 if there are 4 in a row up right', () => {
    let game = new Game();
    game.grid = [
      [0, 2, 0, 1],
      [0, 1, 1, 2],
      [0, 1, 2, 2],
      [1, 1, 2, 2]
    ];
    expect(game.findResult()).toEqual(1)
  });

  it('should return 2 if there are 4 in a row up right', () => {
    let game = new Game();
    game.grid = [
      [0, 0, 0, 2],
      [1, 0, 2, 2],
      [2, 2, 2, 1],
      [2, 1, 2, 1]
    ];
    expect(game.findResult()).toEqual(2)
  });

  it('should return 1 if there are 4 in a row down', () => {
    let game = new Game();
    game.grid = [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [1, 2, 2, 1],
      [1, 1, 2, 1]
    ];
    expect(game.findResult()).toEqual(1)
  });

  it('should return 1 if there are 4 in a row down', () => {
    let game = new Game();
    game.grid = [
      [0, 0, 1, 0],
      [1, 2, 1, 0],
      [2, 2, 1, 2],
      [1, 1, 1, 2]
    ];
    expect(game.findResult()).toEqual(1)
  });

  it('should return 2 if there are 4 in a row down', () => {
    let game = new Game();
    game.grid = [
      [0, 0, 1, 2],
      [2, 0, 2, 2],
      [1, 2, 2, 2],
      [1, 1, 2, 2]
    ];
    expect(game.findResult()).toEqual(2)
  });

  it('should return 1 if there are 4 in a row right', () => {
    let game = new Game();
    game.grid = [
      [0, 0, 0, 0],
      [2, 0, 0, 0],
      [1, 1, 1, 1],
      [1, 1, 2, 2]
    ];
    expect(game.findResult()).toEqual(1)
  });

  it('should return 1 if there are 4 in a row right', () => {
    let game = new Game();
    game.grid = [
      [0, 0, 0, 0],
      [2, 0, 0, 0],
      [2, 2, 2, 0],
      [1, 1, 1, 1]
    ];
    expect(game.findResult()).toEqual(1)
  });

  it('should return 2 if there are 4 in a row right', () => {
    let game = new Game();
    game.grid = [
      [2, 2, 2, 2],
      [2, 1, 2, 1],
      [1, 1, 1, 2],
      [1, 1, 2, 2]
    ];
    expect(game.findResult()).toEqual(2)
  });
});