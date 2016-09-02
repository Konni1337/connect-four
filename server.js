var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var bodyParser = require('body-parser');
import Training from "./js/lib/Training";
import {GAME_TYPE_TRAINING} from "./js/constants/GameFixtures";
import Game from "./js/lib/Game";
import Player from "./js/lib/Player";

var app = express();
var compiler = webpack(config);

const DEFAULT_STATISTICS = {draw: 0, 1: 0, 2: 0};

let trainingsMap = {};
let gamesMap = {};
let statistics = {};


function updateStatistics(id, result) {
  statistics[id][result] += 1;
}

app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/statistics', (req, res) => {
  let body = req.body;
  res.status(200).json(JSON.stringify(statistics[body.id]))
});

app.post('/training', (req, res) => {
  let body = req.body;
  let id = body.gameId;
  let player1 = Player.create(body.player1);
  let player2 = Player.create(body.player2);
  statistics[id] = DEFAULT_STATISTICS;
  let training = new Training(body.trainingIterations, player1, player2, id);
  training.start((result) => updateStatistics(id, result));
  trainingsMap[id] = training;
  res.status(200).json(JSON.stringify({trainingsId: id, statistics: statistics[id]}));
  res.status(200).json({});
});

app.post('/game', (req, res) => {
  let body = req.body;
  let id = body.gameId;
  let player1 = Player.create(body.player1);
  let player2 = Player.create(body.player2);
  statistics[id] = DEFAULT_STATISTICS;
  gamesMap[id] = {game: new Game(id), player1: player1, player2: player2};
  res.status(200).json(JSON.stringify({game: gamesMap[id].game, statistics: statistics[id]}));
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
    updateStatistics(id, game.result);
    res.status(200).json(JSON.stringify({game, statistics: statistics[id]}));
  } else {
    let otherPlayer = gameWrapper['player' + otherPlayerId(move.player)];
    if (!otherPlayer.isHuman()) {
      otherPlayer.selectAction(game, move => {
        game.makeMove(move);
        if (game.isFinished) {
          otherPlayer.endGame(game.result);
          updateStatistics(id, game.result);
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


