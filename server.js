import path from 'path';
import webpack from 'webpack';
import express from 'express';
import webpackConfig from './webpack.config';
import * as config from './js/constants/config';
import bodyParser from 'body-parser';
import Game from "./js/lib/Game";
import Player from "./js/lib/Player";
import threads from 'threads';
import winston from 'winston';
// import decode from './decode';

// Set base paths to thread scripts
threads.config.set({
  basepath: {
    // browser: 'http://localhost:3000/static/worker',
    node: __dirname + '/js/lib/worker'
  }
});

// Maybe load Q-Learning data
if (config.IMPORT_ON_LOAD) {
  decode(config.IMPORT_FILE, err => {
    if (err) winston.error(err);
    winston.info('finished');
  });
}

let app = express();
let compiler = webpack(webpackConfig);

const DEFAULT_STATISTICS = {draw: 0, 1: 0, 2: 0};

let threadMap = {};
let gamesMap = {};
let statisticsMap = {};

app.use(bodyParser.json());
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  historyApiFallback: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use((req, res, next) => {
  if (config.LOG_REQUESTS) {
    let requestInfo = [
      '',
      'Incoming Request:',
      req.method + ' ' + req.url,
      'Request Body:',
      JSON.stringify(req.body, null, 2),
      ''
    ].join('\n');
    winston.info(requestInfo);
  }
  next();
});

app.post('/statistics', (req, res) => {
  let body = req.body;
  let id = body.trainingsId;
  let statistics = statisticsMap[id] || DEFAULT_STATISTICS;
  res.status(200).json(JSON.stringify({
    isFinished: threadMap[id].length === 0,
    statistics: statistics,
    trainingsId: id
  }))
});



app.post('/training', (req, res) => {
  let body = req.body;
  let id = body.gameId;
  let iterations = Math.floor(body.trainingIterations / config.THREAD_COUNT);
  statisticsMap[id] = DEFAULT_STATISTICS;
  threadMap[id] = [];
  let iterationsLeft = iterations;
  function threadIterations() {
    if (iterationsLeft < 100) {
      let tmp = iterationsLeft;
      iterationsLeft = 0;
      return tmp;
    } else {
      iterationsLeft -= 100;
      return 100
    }
  }

  for (let i = 0; i < config.THREAD_COUNT; i++) {
    const thread = threads.spawn('training.js');
    winston.info('training spawned...');
    threadMap[id].push(thread);

    thread.send({iterations: threadIterations(), body})
      .on('done', message => {
        if (message.result) statisticsMap[id][message.result] += 1;
        if (message.isFinished) {
          if (iterationsLeft <= 0) {
            threadMap[id].splice(threadMap[id].indexOf(thread), 1);
            thread.kill();
          } else {
            thread.send({iterations: threadIterations(), body});
          }
        }
      })
      .on('error', error => {
        console.error('error in trainings thread: ' + error);
        threadMap[id].splice(threadMap[id].indexOf(thread), 1);
        thread.kill();
      })
  }
  res.status(200).json(JSON.stringify({trainingsId: id, statistics: DEFAULT_STATISTICS}));


  // let id = body.gameId;
  // let player1 = Player.create(body.player1);
  // let player2 = Player.create(body.player2);
  // let training = new Training(body.trainingIterations, player1, player2, id);
  // // res.status(200).json(JSON.stringify({trainingsId: training.id, statistics: training.statistics}));
  // training.start();
  // trainingCheck(training, res);
});

function trainingCheck(training, res) {
  setTimeout(function () {
    if (training.isFinished()) {
      res.status(200).json(JSON.stringify({trainingsId: training.id, statistics: training.statistics}));
    } else {
      trainingCheck(training, res);
    }
  }, 1000);
}

app.post('/game', (req, res) => {
  let body = req.body;
  let id = body.gameId;
  let player1 = Player.create(body.player1);
  let player2 = Player.create(body.player2);
  statisticsMap[id] = DEFAULT_STATISTICS;
  let game = new Game(id);
  gamesMap[id] = {game, player1, player2};
  if (!player1.isHuman() && player2.isHuman()) {
    player1.selectAction(game, move => {
      game.makeMove(move);
      res.status(200).json(JSON.stringify({game: gamesMap[id].game, statistics: statisticsMap[id]}));
    })
  } else {
    res.status(200).json(JSON.stringify({game: gamesMap[id].game, statistics: statisticsMap[id]}));
  }
});

app.post('/move', (req, res) => {
  let body = req.body;
  let move = body.move, id = body.gameId;
  let {game, player1, player2} = gamesMap[id];
  if (game.currentPlayer === 2) player2 = [player1, player1 = player2][0];
  if (player1.isHuman() && move) {
    if (game.makeMove(move).isFinished) {
      statisticsMap[id][game.result] += 1;
      res.status(200).json(JSON.stringify({game, statistics: statisticsMap[id]}));
    } else {
      if (!player2.isHuman()) {
        player2.selectAction(game, move => {
          if (game.makeMove(move).isFinished) {
            player2.endGame(game.result, 2);
            statisticsMap[id][game.result] += 1;
          }
          res.status(200).json(JSON.stringify({game, statistics: statisticsMap[id]}));
        })
      } else {
        res.status(200).json(JSON.stringify({game, statistics: statisticsMap[id]}));
      }
    }
  } else if (!player1.isHuman() && !player2.isHuman()) {
    player1.selectAction(game, move => {
      if (game.makeMove(move).isFinished) {
        let result = game.result;
        player1.endGame(result, 1);
        player2.endGame(result, 2);
        statisticsMap[id][result] += 1;
      }
      res.status(200).json(JSON.stringify({game, statistics: statisticsMap[id]}));
    })
  } else {
    res.status(400)
  }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function (err) {
  if (err) console.log(err);
  console.log('Listening at localhost:3000');
});

