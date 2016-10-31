import * as T from '../../../testHelper';
import Node from "../../../../js/lib/ai/mcts/Node";
import Game from "../../../../js/lib/Game";
import {MCTS_WIN_VALUE, MCTS_DRAW_VALUE, DRAW} from "../../../../js/constants/GameFixtures";
import RandomMCTS from "../../../../js/lib/ai/mcts/RandomMCTS";
import {MCTS_LOSE_VALUE} from "../../../../js/constants/GameFixtures";
import Root from "../../../../js/lib/ai/mcts/Root";

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

    it('should not return the same instance of parent', () => {
      let root = new Root(game);
      let node = new Node(game, move, root);
      T.expect(node.clone().parent).toNotBe(node.parent);
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
      T.expect(node.wins).toBe(0);
      node.won();
      T.expect(node.wins).toBe(1);
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
      T.expect(node.wins).toBe(0);
      node.draw();
      T.expect(node.wins).toBe(0.5);
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
      T.expect(node.wins).toBe(0);
      node.lost();
      T.expect(node.wins).toBe(0);
    });
  });


  describe('update', () => {
    it('should increment visits', () => {
      let root = new Root(game);
      let rootSpy = T.spyOn(root, 'update');
      let node = new Node(game, move, root);
      let nodeSpy = T.spyOn(node, 'won');
      node.update(game.currentPlayer);

      T.expect(rootSpy.calls.length).toBe(1);
      T.expect(nodeSpy.calls.length).toBe(1);
      rootSpy.restore();
      nodeSpy.restore();
    });

    it('should increment visits if draw', () => {
      let root = new Root(game);
      let rootSpy = T.spyOn(root, 'update');
      let node = new Node(game, move, root);
      let nodeSpy = T.spyOn(node, 'draw');
      node.update(DRAW);
      T.expect(rootSpy.calls.length).toBe(1);
      T.expect(nodeSpy.calls.length).toBe(1);
      rootSpy.restore();
      nodeSpy.restore();
    });

    it('should increment visits if lost', () => {
      let root = new Root(game);
      let rootSpy = T.spyOn(root, 'update');
      let node = new Node(game, move, root);
      let nodeSpy = T.spyOn(node, 'lost');
      node.update(game.currentPlayer + 1);
      T.expect(rootSpy.calls.length).toBe(1);
      T.expect(nodeSpy.calls.length).toBe(1);
      rootSpy.restore();
      nodeSpy.restore();
    });
  });

  describe('finishRandom', () => {
    let root = new Root(game);
    let rootSpy = T.spyOn(root, 'update');
    let node = new Node(game.clone(), move, root);
    let nodeSpy = T.spyOn(RandomMCTS, 'playUntilFinished');
    node.finishRandom();
    T.expect(rootSpy.calls.length).toBe(1);
    T.expect(nodeSpy).toHaveBeenCalledWith(node.game);
    rootSpy.restore();
    nodeSpy.restore();
  });

  describe('expand', () => {
    it('returns a child node that played the next move', () => {
      let root = new Root(game.clone());
      let rootCompare = root.clone();
      let move = rootCompare.unvisitedMoves.pop();
      rootCompare.children = [new Node(game.clone().makeMove(move), move, rootCompare)];
      root.expand();
      // Need to set parent to null, otherwise its not possible to check equality of circular dependency
      root.children[0].parent = null;
      rootCompare.children[0].parent = null;

      // Equals doesn't work directly on the nodes although every instance variable has equality
      T.expect(root.game).toEqual(rootCompare.game);
      T.expect(root.move).toEqual(rootCompare.move);
      T.expect(root.parent).toEqual(rootCompare.parent);
      T.expect(root.wins).toEqual(rootCompare.wins);
      T.expect(root.visits).toEqual(rootCompare.visits);
      T.expect(root.children).toEqual(rootCompare.children);
      T.expect(root.unvisitedMoves).toEqual(rootCompare.unvisitedMoves);
    });
  });

  describe('utcValue()', () => {
    it('should return INFINITY if visits are 0', () => {
      let node = new Node(game, move, new Root(game));
      T.expect(node.utcValue()).toEqual(Number.POSITIVE_INFINITY);
    });

    it('should return correct utcValue if value are 0', () => {
      let root = new Root(game);
      root.visits = 2;
      let node = new Node(game, move, root);
      node.visits = 2;
      T.expect(T.roundDecimal(node.utcValue(), 9)).toEqual(1.177410023); // calculated by hand
    });

    it('should return correct utcValue', () => {
      let root = new Root(game);
      root.visits = 2;
      let node = new Node(game, move, root);
      node.visits = 2;
      node.wins = 2;
      T.expect(T.roundDecimal(node.utcValue(), 9)).toEqual(2.177410023); // calculated by hand
    });
  });

  describe('value', () => {
    it('should return 0 if visits, value are 0', () => {
      let node = new Node(game, move);
      T.expect(node.value()).toEqual(0);
    });

    it('should calculate the win percentage', () => {
      let node = new Node(game, move);
      node.wins = 2;
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
      child2.wins = 1;
      T.expect(node.utcChild()).toBe(child2);
    });
  })
});
