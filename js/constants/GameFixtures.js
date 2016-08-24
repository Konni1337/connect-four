export const UCT_FACTOR = 5;
export const DRAW = 'draw';
export const HUMAN = 'Human Player';
export const MCTS = 'Monte Carlo Tree Search';
export const Q_LEARNING = 'QLearning';
export const RANDOM = 'Random';
export const PLAYER_TYPES = [HUMAN, MCTS, Q_LEARNING, RANDOM];
export const GRID_LENGTH = 5;
export const GRID_HEIGHT = 5;
export const EMPTY_VALUE = 0;

export const Q_LEARNING_CONFIG = {
  DEFAULT_REWARDS: {
    won: 100,
    lost: -100,
    draw: -1
  },
  DEFAULT_EXPERIENCE: 'default',
  DEFAULT_ALPHA_0: 0.5,
  DEFAULT_GAMMA: 1,
  DEFAULT_EPSILON: 0.001,
  DEFAULT_DYNAMIC_ALPHA: true,
  DEFAULT_E_2: 3.0
};