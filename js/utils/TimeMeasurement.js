import moment from "moment";
import fs from 'fs';
import path from 'path';
import * as config from '../constants/config';

export default class TimeMeasurement {
  constructor(defaultTrials = 1) {
    this.defaultTrials = defaultTrials;
  }

  measureTime(fn, startTime = moment().format('x')) {
    fn();
    return parseInt(moment().format('x')) - parseInt(startTime);
  }

  measureAverageTime(fn, trials) {
    if (!trials) trials = this.defaultTrials;
    if (isNaN(trials) || trials < 1) throw "Argument 'trials' need to be a number greater than 0.";

    let durationSum = 0;
    for (let i = 0; i < trials; i++) {
      durationSum += this.measureTime(fn);
    }

    return durationSum / trials;
  }

  logTime(dirName = '', fnName = '', trials = 0, averageTime = 0) {
    if (!dirName || dirName === '') throw "Argument 'dirName' is required. Empty string is not allowed.";
    if (!fnName || fnName === '') throw "Argument 'fnName' is required. Empty string is not allowed.";
    let filePath = [config.PERF_RESULT_FOLDER, dirName, 'performanceResults.json'].join('/');
    let data = fs.readFileSync(ensureExistence(filePath), 'utf-8');
    try {
      data = JSON.parse(data);
    } catch (ignore) {
      data = {}
    }
    data[fnName] = {trials, averageTime};
    fs.writeFileSync(filePath, JSON.stringify(data));
  }
}

function ensureExistence(filePath) {
  let baseName = path.basename(filePath);
  let dirName = path.dirname(filePath);
  try {
    fs.statSync(baseName).isFile();
  } catch (ignore) {
    if (ensureDir(dirName)) fs.writeFileSync(filePath, '');
  }
  return filePath
}

function ensureDir(dirPath) {
  try {
    fs.statSync(dirPath).isDirectory();
  }
  catch (ignore) {
    if (ensureDir(path.dirname(dirPath))) fs.mkdirSync(dirPath);
  }
  return true;
}