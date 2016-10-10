import threads from 'threads'

// Set base paths to thread scripts
threads.config.set({
  basepath: {
    browser: 'http://localhost:3000/static/worker',
    node: __dirname + '/../worker'
  }
});

console.log('bla');

const thread = threads.spawn('root.js');

thread
  .send({test: 'test'})
  .on('message', function (message) {
    console.log('worker.js replied:', message);
  });
