import dbLayer from '../ai/dbLayer/dbLayer';

module.exports = function(input, done) {
  let {id, method, args} = input;

  let db = dbLayer.getDatabase(id);
  switch (method) {
    case 'get':
      db.get(args.key, function (err, value) {
        if (err) throw err;
        done({value})
      });
      break;
    case 'set':
      db.set(args.key, args.value, function (err) {
        if (err) throw err;
        done()
      });
      break;
    default:
      throw 'method ' + method + ' is not supported';
      break;
  }
};
