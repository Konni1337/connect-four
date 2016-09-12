var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var bodyParser = require('body-parser');
var fs = require("fs")
import Training from "./js/lib/Training";
import Game from "./js/lib/Game";
import Player from "./js/lib/Player";
import winston from 'winston';


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
let statistics = {};




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
  res.status(200).json(JSON.stringify({
    isFinished: trainingsMap[id].isFinished,
    statistics: statistics[id],
    trainingsId: id
  }))
});

app.post('/training', (req, res) => {
  let body = req.body;
  let id = body.gameId;
  let player1 = Player.create(body.player1);
  let player2 = Player.create(body.player2);
  let training = new Training(body.trainingIterations, player1, player2, id);
  training.start();
  trainingCheck(training, res)
  // res.status(200).json(JSON.stringify({trainingsId: id, statistics: training.statistics}));
});

function trainingCheck(training, res) {
  setTimeout(function() {
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
  statistics[id] = DEFAULT_STATISTICS;
  let game = new Game(id);
  gamesMap[id] = {game, player1, player2};
  if (!player1.isHuman()) {
    player1.selectAction(game, move => {
      game.makeMove(move);
      res.status(200).json(JSON.stringify({game: gamesMap[id].game, statistics: statistics[id]}));
    })
  } else {
    res.status(200).json(JSON.stringify({game: gamesMap[id].game, statistics: statistics[id]}));
  }
});

app.post('/ai-move', (req, res) => {
  // TODO Handle both AI
  let body = req.body;
  let move = body.move;
  let id = body.gameId;
  let gameWrapper = gamesMap[id];
  let game = gameWrapper.game;
  game.makeMove(move);
  if (game.isFinished) {
    statistics[id][game.result] += 1;
    res.status(200).json(JSON.stringify({game, statistics: statistics[id]}));
  } else {
    let otherPlayer = gameWrapper['player' + otherPlayerId(move.player)];
    if (!otherPlayer.isHuman()) {
      otherPlayer.selectAction(game, move => {
        game.makeMove(move);
        if (game.isFinished) {
          otherPlayer.endGame(game.result);
          statistics[id][game.result] += 1;
        }
        res.status(200).json(JSON.stringify({game, statistics: statistics[id]}));
      })
    } else {
      res.status(200).json(JSON.stringify({game, statistics: statistics[id]}));
    }
  }
});

app.post('/move', (req, res) => {
  // TODO Handle both AI
  let body = req.body;
  let move = body.move;
  let id = body.gameId;
  let gameWrapper = gamesMap[id];
  let game = gameWrapper.game;
  game.makeMove(move);
  if (game.isFinished) {
    statistics[id][game.result] += 1;
    res.status(200).json(JSON.stringify({game, statistics: statistics[id]}));
  } else {
    let otherPlayer = gameWrapper['player' + otherPlayerId(move.player)];
    if (!otherPlayer.isHuman()) {
      otherPlayer.selectAction(game, move => {
        game.makeMove(move);
        if (game.isFinished) {
          otherPlayer.endGame(game.result);
          statistics[id][game.result] += 1;
        }
        res.status(200).json(JSON.stringify({game, statistics: statistics[id]}));
      })
    } else {
      res.status(200).json(JSON.stringify({game, statistics: statistics[id]}));
    }
  }
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function (err, result) {
  if (err) console.log(err);
  console.log('Listening at localhost:3000');
});

function otherPlayerId(id) {
  return id === 1 ? 2 : 1
}


