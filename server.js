var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var bodyParser = require('body-parser');
var fs = require("fs");
// import Training from "./js/lib/Training";
import Game from "./js/lib/Game";
import {DRAW} from "./js/constants/GameFixtures";
import Player from "./js/lib/Player";
// import "./js/lib/ai/test.js";
import threads from 'threads'

// Set base paths to thread scripts
threads.config.set({
  basepath: {
    // browser: 'http://localhost:3000/static/worker',
    node: __dirname + '/js/lib/worker'
  }
});

// import decode from './decode';
// decode('ql-vs-mmmc.exp2', err => {
//   if (err) winston.error(err);
//   winston.info('finished');
// });

var app = express();
var compiler = webpack(config);

const DEFAULT_STATISTICS = {draw: 0, 1: 0, 2: 0};

let trainingsMap = {};
let gamesMap = {};
let statisticsMap = {};


app.use(bodyParser.json());
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.post('/statistics', (req, res) => {
  let body = req.body;
  let id = body.trainingsId;
  let statistics = statisticsMap[id] || DEFAULT_STATISTICS;
  res.status(200).json(JSON.stringify({
    isFinished: false,
    statistics: statistics,
    trainingsId: id
  }))
});

app.post('/training', (req, res) => {
  let body = req.body;
  let id = body.gameId;
  var iterations = Math.floor(body.trainingIterations / 10);
  statisticsMap[id] = DEFAULT_STATISTICS;
  for (let i = 0; i < 10; i++) {
    const thread = threads.spawn('root.js');
    thread.send({iterations, body})
      .on('done', message => {
        console.log('worker sent message: ' + message.result);
        if (message.result) statisticsMap[id][message.result] += 1;
        if (message.isFinished) thread.kill();
      })
      .on('error', error => console.error(error))
  }
  res.status(200).json(JSON.stringify({trainingsId: id, statistics: DEFAULT_STATISTICS}));


  // let id = body.gameId;
  // let player1 = Player.create(body.player1);
  // let player2 = Player.create(body.player2);
  // let training = new Training(body.trainingIterations, player1, player2, id);
  // res.status(200).json(JSON.stringify({trainingsId: training.id, statistics: training.statistics}));
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
            player2.endGame(game.result);
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
        player1.endGame(result);
        player2.endGame(result);
        statisticsMap[id][result] += 1;
      }
      res.status(200).json(JSON.stringify({game, statistics: statisticsMap[id]}));
    })
  } else {
    res.status(400)
  }
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function (err) {
  if (err) console.log(err);
  console.log('Listening at localhost:3000');
});

