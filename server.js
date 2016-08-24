var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var levelup = require('levelup');
var bodyParser = require('body-parser');

var app = express();
var compiler = webpack(config);

var INITIAL_QVALUE = 0.5;
var dbMap = {};

function db(id) {
  var db = dbMap[id];
  if (db) {
    return db
  } else {
    var newDb = levelup('./db/' + id + '/');
    dbMap[id] = newDb;
    return newDb;
  }
}

function getValue(id, stateAction, callback) {
  db(id).get(stateActionToString(stateAction), function (err, value) {
    callback(err || !value ? INITIAL_QVALUE : value);
  });
}

function getAll(id, stateActions = [], callback) {
  _getAll(id, stateActions, [], callback)
}

function _getAll(id, stateActions, stateActionValues, callback) {
  if (stateActions.length === 0) return callback(stateActionValues);
  let stateAction = stateActions.pop();
  getValue(id, stateAction, function (value) {
    stateActionValues.push({stateAction: stateAction, value: value});
    _getAll(id, stateActions, stateActionValues, callback)
  })
}

app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.post('/q-learning/get', function (req, res) {
  // var count = 0;
  // db.createKeyStream()
  //   .on('data', function (data) {
  //     count++;
  //   })
  //   .on('end', function () {
  //     console.log(count)
  //   });
  let body = req.body;
  let stateAction = body.stateAction;
  if (stateAction) {
    getValue(body.id, stateAction, function (value) {
      res.status(200).json(JSON.stringify({value: value}));
    })
  } else {

    res.status(400).send('parameter key needed');
  }
});

app.post('/q-learning/best', function (req, res) {
  let body = req.body;
  let stateActions = body.stateActions;
  if (stateActions && stateActions.length > 0) {
    getAll(body.id, stateActions, function (stateActionValues) {
      let best = null;
      stateActionValues.forEach(function (stateActionValue) {
        if (!best || best.value < stateActionValue.value) best = stateActionValue
      });
      res.status(200).json(JSON.stringify({bestStateActionValue: best}));
    });
  } else {
    res.status(400).send('parameter key needed');
  }
});

app.post('/q-learning/set', function (req, res) {
  let body = req.body;
  let stateAction = body.stateAction;
  let value = body.value;
  if (stateAction && !isNaN(value)) {
    // console.log(stateActionToString(stateAction));
    // if (stateActionToString(stateAction) === '') {
    //   console.log(stateAction)
    // }
    db(body.id).put(stateActionToString(stateAction), value, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('could not save data');
      } else {
        console.log(body.id + " set value " + value);
        res.status(200).send();
      }
    });
  } else {
    res.status(400).send('parameter key needed');
  }
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function (err, result) {
  if (err) console.log(err);
  console.log('Listening at localhost:3000');
});


function stateForPlayer(grid, playerId) {
  const stateArray = [];
  for (let y = grid[0].length - 1; y >= 0; y--) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[x][y] === playerId) stateArray.push(x + 1);
    }
  }
  return stateArray;
}

function stateActionToString(stateAction) {
  let grid = stateAction.state; // 2D grid array
  const player1State = stateForPlayer(grid, 1);
  const player2State = stateForPlayer(grid, 2);
  let stateString = player1State.reduce(function (stateString, value, index) {
    if (player2State.length === index) {
      return stateString + value;
    } else {
      return stateString + value + player2State[index];
    }
  }, '');
  return stateString + '.' + stateAction.action.index;
}