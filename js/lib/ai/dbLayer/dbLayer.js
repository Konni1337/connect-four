const levelup = require('levelup');

class DbLayer {
  constructor() {
    this.dbMap = {}
  }

  getDatabase(id) {
    let db = this.dbMap[id];
    if (!db) {
      db = levelup('./db/' + id + '/');
      this.dbMap[id] = db;
    }
    return db;
  }
}

const dbLayer = new DbLayer();
export default dbLayer;
