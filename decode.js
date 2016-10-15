/** NodeJS module for loading learning experience for Q-Learning
 *
 *  Usage: (Standalone)
 *    node decode.js <expfile> 1> data.json
 *      - this will write the learndata form the exp file as json into data.json
 *
 *  Usage: (Module)
 *    let decoder = require('./decode')
 *    decoder(fileName, callback(err,data), progress(percent))
 */

import fs from "fs";
import winston from 'winston';
import dbLayer from "./js/lib/ai/dbLayer/dbLayer";
import {importedStateToString} from './js/lib/ai/dbLayer/stateToKeyString';


function BufferObject(buffer) {
  this.offset = 0;
  this.buffer = buffer
}

/** Helper function to load LONG values from a buffer
 *  source: http://stackoverflow.com/questions/14002205/read-int64-from-node-js-buffer-with-precision-loss
 */
BufferObject.prototype.readInt64BE = function (offset) {
  if (offset !== undefined)
    this.offset = offset;

  let low = this.buffer.readInt32BE(this.offset + 4);
  let n = this.buffer.readInt32BE(this.offset) * 4294967296.0 + low;
  this.offset += 8;
  if (low < 0)
    n += 4294967296;
  return n
};

/** Helper function to read dynamic length string
 */
BufferObject.prototype.readString = function (offset) {
  if (offset !== undefined)
    this.offset = offset;

  let length = this.buffer.readUInt32BE(this.offset);
  this.offset += 4 + length;
  return this.buffer.toString('utf8', this.offset - length, this.offset)
};

BufferObject.prototype.readUInt32BE = function (offset) {
  if (offset !== undefined)
    this.offset = offset;
  this.offset += 4;

  return this.buffer.readUInt32BE(this.offset - 4)
};

BufferObject.prototype.readDoubleBE = function (offset) {
  if (offset !== undefined)
    this.offset = offset;
  this.offset += 8;
  return this.buffer.readDoubleBE(this.offset - 8)
};

/** Load the data, stored in an exp2 file
 *
 * @param fileName the file to load the experience from
 * @param callback(err, data) async callback which gets called as soon as the data has been loaded
 * @param progress(percent) async callback which gets called, whenever a percent of the learndata has been loaded
 */
function loadData(fileName, callback, progress) {
  let data = {};
  let db = dbLayer.getDatabase('default');
  progress = progress || function (percent) {
    };

  fs.readFile(fileName, function (err, buffer) {
    if (err) return callback(err);

    let buff = new BufferObject(buffer);

    //Validate header contant and version
    if (buff.readUInt32BE() != 0xFFFFFFFF || buff.readUInt32BE() != 0x01)
      return callback(new Error("Cannot load data. Invalid learn data header."));

    //Read in data
    data.episodes = buff.readInt64BE();
    data.agentClass = buff.readString();
    data.agentName = buff.readString();
    data.entries = buff.readUInt32BE();
    data.experience = [];

    let percentage = data.entries / 100;

    //Read in entries
    let loadEntries = function (offset) {
      let i = 0;
      data.experience = [];
      for (; i < percentage && (i + offset) < data.entries; ++i) {
        let state = buff.readString();
        let action = buff.readUInt32BE();
        let value = buff.readDoubleBE();
        let stringState = importedStateToString(state, action);
        // if (state.length === 1) {
        //   winston.info('state: ' + state + ' action: ' + action);
        //   winston.info('state: ' + state);
        //   winston.info('action: ' + action);
        //   winston.info('value: ' + value);
        //   winston.info('stringState: ' + stringState);
        // }
        data.experience.push({type: 'put', key: stringState, value});
      }

      let loadedEntries = i + offset;

      process.nextTick(function () {
        let prog = parseInt(loadedEntries / data.entries * 100);
        winston.info(prog + '% imported');
        progress(prog)
      });
      if (loadedEntries < data.entries) {
        process.nextTick(() => {
          db.batch(data.experience, function (err) {
            if (err) return winston.info('Ooops!', err);
            loadEntries(offset + i);
          });
        });
      } else {
        process.nextTick(function () {
          winston.info('finished');
        })
      }
    };

    loadEntries(0)
  })
}

module.exports = loadData;


if (!module.parent) { //Called directly
  if (!process.argv[2]) {
    console.error("Missing file to load as argument.");
    console.error("Usage: node decode.js <expfile> 1> data.json")
  } else {
    loadData(process.argv[2], function (err, data) {
      if (err)
        console.error("Failed to load learn data from '" + process.argv[2] + "'", err);
      else {
        console.error("Stringifying data and writing it to stdout. This might take a while, depending on the size of the data.");
        console.log(JSON.stringify(data, null, 2))
      }
      //Write load state to stderr to pipe json via stdout
    }, function (percent) {
      console.error("Loaded " + percent + "%")
    })
  }
}

