export expect from 'expect';
import TimeMeasurement from "../js/utils/TimeMeasurement";
import '../js/extensions/arrayExtensions'
import moment from 'moment';

const timeMeasurer = new TimeMeasurement(100);
const timeStamp = moment().format();

export function perf(title, trials, test) {
  if (isNaN(trials) && typeof trials === 'function') {
    test = trials;
    trials = timeMeasurer.defaultTrials;
  } else {
    throw "Function 'perf' needs a function to run.";
  }
  return performance(title, process.env.LOG_PERF, test, trials);
}

function performance(title, log = false, test, trials) {
  let averageTimeMs = timeMeasurer.measureAverageTime(test, trials);
  if (log) timeMeasurer.logTime(timeStamp, title, trials, averageTimeMs);
  return it(title + '(Average Time ' + averageTimeMs + 'ms and ' + trials + ' trials)', () => true);
}

