import threads from 'threads';
import winston from 'winston';

threads.config.set({
  basepath: {
    browser: 'http://localhost:3000/static/worker',
    node: __dirname + '/../../worker'
  }
});

let dbWorker = threads.spawn('dbWorker.js');
winston.info('dbWorker spawned...');

class DBInterface {
  constructor() {
    this.db = dbWorker;
  }

  get(id, key, callback) {
    try {
      return new Promise((resolve, reject) => {
        this.db
          .send({id: id, method: 'get', args: {key}})
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

  set(id, key, value, callback) {
    return new Promise((resolve, reject) => {
      this.db
        .send({id: id, method: 'set', args: {key, value}})
        .on('done', message => resolve())
        .on('error', err => reject(err));
    }).then(callback)
      .catch(callback);
  }
}
const dbInterface = new DBInterface();
export default dbInterface;


