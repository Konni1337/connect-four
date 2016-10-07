import * as T from '../../../testHelper';
import Node from "../../../../js/lib/ai/mcts/Node";
import Game from "../../../../js/lib/Game";
import {MCTS_WIN_REWARD, MCTS_DRAW_REWARD, DRAW} from "../../../../js/constants/GameFixtures";
import RandomMCTS from "../../../../js/lib/ai/mcts/RandomMCTS";
import {MCTS_LOSE_REWARD} from "../../../../js/constants/GameFixtures";

describe('Node', () => {
  const game = new Game('id');
  const move = game.getValidMoves()[0];

  describe('clone', () => {

    it('should return a copy of the node', () => {
      let node = new Node(game, move);
      T.expect(node.clone()).toEqual(node);
    });

    it('should not return the same instance of node', () => {
      let node = new Node(game, move);
      T.expect(node.clone()).toNotBe(node);
    });

    it('should not return the same instance of game', () => {
      let node = new Node(game, move);
      T.expect(node.clone().game).toNotBe(node.game);
    });

    it('should not return the same instance of move', () => {
      let node = new Node(game, move);
      T.expect(node.clone().move).toNotBe(node.move);
    });

    it('should not return the same instance of unvisitedMoves', () => {
      let node = new Node(game, move);
      T.expect(node.clone().unvisitedMoves).toNotBe(node.unvisitedMoves);
    });

    it('should not return the same instance of children', () => {
      let node = new Node(game, move);
      let childNode = new Node(game, move);
      node.children.push(childNode);
      T.expect(node.clone().children).toNotBe(node.children);
      T.expect(node.clone().children[0]).toNotBe(node.children[0]);
    });
  });

  describe('isLeaf', () => {
    it('should return false if game is not in finished state', () => {
      let node = new Node(game, move);
      T.expect(node.isLeaf()).toBe(false);
    });

    it('should return true if game is in finished state', () => {
      let finishedGame = game.clone();
      finishedGame.isFinished = true;
      let node = new Node(finishedGame, move);
      T.expect(node.isLeaf()).toBe(true);
    });
  });

  describe('hasMovesLeft', () => {
    it('should return false if all moves where visited', () => {
      let node = new Node(game, move);
      node.unvisitedMoves = [];
      T.expect(node.hasMovesLeft()).toBe(false);
    });

    it('should return true if there are unvisited moves', () => {
      let node = new Node(game, move);
      T.expect(node.hasMovesLeft()).toBe(true);
    });
  });

  describe('won', () => {
    it('should increment visits', () => {
      let node = new Node(game, move);
      T.expect(node.visits).toBe(0);
      node.won();
      T.expect(node.visits).toBe(1);
    });

    it('should add win reward', () => {
      let node = new Node(game, move);
      T.expect(node.summedValue).toBe(0);
      node.won();
      T.expect(node.summedValue).toBe(MCTS_WIN_REWARD);
    });
  });

  describe('draw', () => {
    it('should increment visits', () => {
      let node = new Node(game, move);
      T.expect(node.visits).toBe(0);
      node.draw();
      T.expect(node.visits).toBe(1);
    });

    it('should add the draw reward', () => {
      let node = new Node(game, move);
      T.expect(node.summedValue).toBe(0);
      node.draw();
      T.expect(node.summedValue).toBe(MCTS_DRAW_REWARD);
    });
  });

  describe('lost', () => {
    it('should increment visits', () => {
      let node = new Node(game, move);
      T.expect(node.visits).toBe(0);
      node.lost();
      T.expect(node.visits).toBe(1);
    });

    it('should add the lose reward', () => {
      let node = new Node(game, move);
      T.expect(node.summedValue).toBe(0);
      node.lost();
      T.expect(node.summedValue).toBe(MCTS_LOSE_REWARD);
    });
  });


  describe('update', () => {
    it('should increment visits', () => {
      let node = new Node(game, move);
      let spy = T.spyOn(node, 'won');
      node.update(game.currentPlayer);
      T.expect(spy).toHaveBeenCalled();
      spy.restore();
    });

    it('should increment visits if draw', () => {
      let node = new Node(game, move);
      let spy = T.spyOn(node, 'draw');
      node.update(DRAW);
      T.expect(spy).toHaveBeenCalled();
      spy.restore();
    });

    it('should increment visits if lost', () => {
      let node = new Node(game, move);
      let spy = T.spyOn(node, 'lost');
      node.update(game.currentPlayer + 1);
      T.expect(spy).toHaveBeenCalled();
      spy.restore();
    });
  });

  describe('playRandom', () => {
    let node = new Node(game, move).clone();
    let spy = T.spyOn(RandomMCTS, 'playUntilFinished');
    node.playRandom();
    T.expect(spy).toHaveBeenCalledWith(node.game);
    spy.restore();
  });

  describe('expand', () => {
    it('returns a child node that played the next move', () => {
      let node = new Node(game.clone());
      let nodeCompare = node.clone();
      let move = nodeCompare.unvisitedMoves.pop();
      nodeCompare.children = [new Node(game.clone().makeMove(move), move)];
      node.expand();
      T.expect(node).toEqual(nodeCompare);
    });
  });

  describe('utcValue()', () => {
    it('should return 0 if visits, value and parent visits are 0', () => {
      let node = new Node(game, move);
      T.expect(node.utcValue(0)).toEqual(0);
    });

    it('should return correct utcValue if value are 0', () => {
      let node = new Node(game, move);
      node.visits = 2;
      T.expect(T.roundDecimal(node.utcValue(2), 9)).toEqual(0.263276885); // calculated by hand
    });

    it('should return correct utcValue', () => {
      let node = new Node(game, move);
      node.visits = 2;
      node.summedValue = 2;
      T.expect(T.roundDecimal(node.utcValue(2), 9)).toEqual(1.263276885); // calculated by hand
    });
  });

  describe('value', () => {
    it('should return 0 if visits, value are 0', () => {
      let node = new Node(game, move);
      T.expect(node.value()).toEqual(0);
    });

    it('should calculate the win percentage', () => {
      let node = new Node(game, move);
      node.summedValue = 2;
      node.visits = 5;
      T.expect(node.value()).toEqual(2 / 5);
    });
  });

  describe('utcChild', () => {
    it('should return the first child if every utcValue is the same', () => {
      let node = new Node(game, move);
      let child = node.expand();
      node.expand();
      T.expect(node.utcChild()).toBe(child);
    });

    it('should return the child with the highest utcValue', () => {
      let node = new Node(game, move);
      node.visits = 1;
      let child = node.expand();
      child.visits = 1;
      let child2 = node.expand();
      child2.visits = 1;
      child2.summedValue = 1;
      T.expect(node.utcChild()).toBe(child2);
    });
  })
});
