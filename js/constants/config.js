// folder where you want to save the performance results
export const PERF_RESULT_FOLDER = 'logs/performance/results';
// Set to true if you want to let the qlearning agent learn;
export const PERSIST = true;
// Value used if no q value is set for the state yet
export const INITIAL_QVALUE = 0.0;
// Set to true if you want to log every request made to the server
export const LOG_REQUESTS = false;
// Set to true and change the path to the experience file if you want to import it on server start
export const IMPORT_ON_LOAD = false;
export const IMPORT_FILE = '/home/ubuntu/Downloads/ql-vs-mmmc.exp2';
export const IMPORT_NAME = 'ql-vs-mmmc';
// Be aware that multithreading might not work for Q-Learning
export const THREAD_COUNT = 1;
// Db prefixes
export const STATISTICS_DB_PREFIX = 'stat';
export const MCTS_DB_PREFIX = 'mcts';
export const QL_DB_PREFIX = 'ql';
// Always perform the best action on start
export const BEST_FIRST_ACTION = true;
// A statistics snapshot will be made every n episodes
export const EPISODES_NEEDED_FOR_STATISTICS_UPDATE = 1000;
