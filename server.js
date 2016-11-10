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
import uuid from 'node-uuid';
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
let scoresMap = {};

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

app.post('/scores', (req, res) => {
  let body = req.body;
  let id = body.trainingsId;
  let scores = scoresMap[id] || Object.assign({}, DEFAULT_STATISTICS);
  res.status(200).json(JSON.stringify({
    isFinished: threadMap[id].length === 0,
    scores: scores,
    trainingsId: id
  }))
});


app.post('/training', (req, res) => {
  let body = req.body;
  let id = uuid.v1();
  console.log(id)
  body.gameId = id;
  let iterations = Math.floor(body.iterations / config.THREAD_COUNT);
  scoresMap[id] = Object.assign({}, DEFAULT_STATISTICS);
  threadMap[id] = [];
  for (let i = 0; i < config.THREAD_COUNT; i++) {
    const thread = threads.spawn('training.js');
    winston.info('training thread spawned...');
    threadMap[id].push(thread);
    thread
      .send({iterations, body})
      .on('progress', function (result) {
        scoresMap[id][result] += 1;
      })
      .on('done', function () {
        threadMap[id].splice(threadMap[id].indexOf(thread), 1);
        thread.kill();
        console.log('training thread is done');
      })
      .on('error', error => {
        console.log(error);
        threadMap[id].splice(threadMap[id].indexOf(thread), 1);
        thread.kill();
        console.log('training thread interrupted');
      });
  }
  res.status(200).json(JSON.stringify({trainingsId: id, scores: Object.assign({}, DEFAULT_STATISTICS)}));
});

function trainingCheck(training, res) {
  setTimeout(function () {
    if (training.isFinished()) {
      res.status(200).json(JSON.stringify({trainingsId: training.id, scores: training.scores}));
    } else {
      trainingCheck(training, res);
    }
  }, 1000);
}

app.post('/new-game', (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  let body = req.body,
    id = uuid.v1(),
    game = new Game(id, body.grid.columns, body.grid.rows);

  Player.create(body.player1, player1 => {
    Player.create(body.player2, player2 => {
      scoresMap[id] = Object.assign({}, DEFAULT_STATISTICS);
      gamesMap[id] = {game, player1, player2};

      if (!player1.isHuman() && player2.isHuman()) {
        // Make initial AI-Move
        player1.selectAction(game, move => {
          res.status(200).json(JSON.stringify({game: game.makeMove(move), scores: scoresMap[id]}));
        })
      } else {
        res.status(200).json(JSON.stringify({game: gamesMap[id].game, scores: scoresMap[id]}));
      }
    });
  });
});

app.post('/move', (req, res) => {
  let body = req.body;
  let move = body.move, id = body.gameId;
  let {game, player1, player2} = gamesMap[id];
  if (game.currentPlayer === 2) {
    let tmpPlayer = player1;
    player1 = player2;
    player2 = tmpPlayer;
  }
  if (player1.isHuman() && move) {
    if (game.makeMove(move).isFinished) {
      scoresMap[id][game.result] += 1;
      res.status(200).json(JSON.stringify({game, scores: scoresMap[id]}));
    } else {
      if (!player2.isHuman()) {
        player2.selectAction(game, move => {
          if (game.makeMove(move).isFinished) {
            player2.endGame(game.result, () => {
              scoresMap[id][game.result] += 1;
              res.status(200).json(JSON.stringify({game, scores: scoresMap[id]}));
            });
          } else {
            res.status(200).json(JSON.stringify({game, scores: scoresMap[id]}));
          }
        })
      } else {
        res.status(200).json(JSON.stringify({game, scores: scoresMap[id]}));
      }
    }
  } else if (!player1.isHuman() && !player2.isHuman()) {
    player1.selectAction(game, move => {
      if (game.makeMove(move).isFinished) {
        let result = game.result;
        player1.endGame(result, () => {
          player2.endGame(result, () => {
            scoresMap[id][result] += 1;
            res.status(200).json(JSON.stringify({game, scores: scoresMap[id]}));
          });
        });
      } else {
        res.status(200).json(JSON.stringify({game, scores: scoresMap[id]}));
      }
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

