import threads from 'threads';
import winston from 'winston';
threads.config.set({
  basepath: {
    browser: 'http://localhost:3000/static/worker',
    node: __dirname + '/../../worker'
  }
});
const dbWorker = threads.spawn('dbWorker.js');

export default class dbInterface {
  constructor(id) {
    this.id = id;
  }

  get(key, callback) {
    try {
      return new Promise((resolve, reject) => {
        dbWorker
          .send({id: this.id, method: 'get', args: {key}})
          .on('done', message => resolve(null, message.value))
          .on('error', err => reject(err));
      }).then(value => {
          callback(null, value)
        })
        .catch(callback);
    } catch (err) {
      winston.error(err);
    }
  }

  set(key, value, callback) {
    return new Promise((resolve, reject) => {
      dbWorker
        .send({id: this.id, method: 'set', args: {key, value}})
        .on('done', message => resolve())
        .on('error', err => reject(err));
    }).then(callback)
      .catch(callback);
  }
}



