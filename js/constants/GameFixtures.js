export const DRAW = 'draw';
export const HUMAN = 'Human Player';
export const MCTS = 'Monte Carlo Tree Search';
export const Q_LEARNING = 'QLearning';
export const RANDOM = 'Random';
export const GRID_LENGTH = 7;
export const GRID_HEIGHT = 6;
export const EMPTY_VALUE = 0;

export const DEFAULT_MAX_DEPTH = 1000;

export const Q_LEARNING_CONFIG = {
  DEFAULT_REWARDS: {
    won: 100,
    lost: -100,
    draw: -1
  },
  DEFAULT_EXPERIENCE: 'default',
  DEFAULT_ALPHA_0: 0.1,
  DEFAULT_GAMMA: 0.9,
  DEFAULT_EPSILON: 0.001,
  DEFAULT_DYNAMIC_ALPHA: true,
  DEFAULT_E_2: 3.0
};
