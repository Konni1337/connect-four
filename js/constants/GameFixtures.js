export const UCT_FACTOR = 2;
export const DRAW = 'draw';
export const HUMAN = 'Human Player';
export const MCTS = 'Monte Carlo Tree Search';
export const Q_LEARNING = 'QLearning';
export const PLAYER_TYPES = [HUMAN, MCTS, Q_LEARNING];

export const Q_LEARNING_CONFIG = {
  DEFAULT_REWARDS: {
    won: 1,
    lost: 0,
    draw: 0.5
  },
  DEFAULT_EXPERIENCE: 'default',
  DEFAULT_ALPHA_0: 0.5,
  DEFAULT_GAMMA: 0.7,
  DEFAULT_EPSILON: 0.1,
  DEFAULT_DYNAMIC_ALPHA: false,
  DEFAULT_E_2: 0.0
};