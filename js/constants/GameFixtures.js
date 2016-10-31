export const UCT_FACTOR = 1 / Math.sqrt(2);
export const DRAW = 'draw';
export const HUMAN = 'Human Player';
export const MCTS = 'Monte Carlo Tree Search';
export const Q_LEARNING = 'QLearning';
export const RANDOM = 'Random';
export const PLAYER_TYPES = [Q_LEARNING, HUMAN, MCTS, RANDOM];
export const PLAYER_TYPES_FOR_TRAINING = [Q_LEARNING, MCTS, RANDOM];
export const GRID_LENGTH = 7;
export const GRID_HEIGHT = 7;
export const EMPTY_VALUE = 0;
export const GAME_TYPE_NORMAL = 'normal';
export const GAME_TYPE_TRAINING = 'training';
export const GAME_TYPE_NONE = 'none';

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
