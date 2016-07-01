var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var levelup = require('levelup');
var db = levelup('./db');
var bodyParser = require('body-parser')

var app = express();
var compiler = webpack(config);

var INITIAL_QVALUE = 0.5;

function getValue(stateAction, callback) {
  db.get(stateActionToString(stateAction), function (err, value) {
    callback(err ? INITIAL_QVALUE : value);
  });
}

function getAll(stateActions = [], callback) {
  _getAll(stateActions, [], callback)
}

function _getAll(stateActions, stateActionValues, callback) {
  if (stateActions.length === 0) return callback(stateActionValues);
  let stateAction = stateActions.pop();
  getValue(stateAction, function (value) {
    stateActionValues.push({stateAction: stateAction, value: value});
    _getAll(stateActions, stateActionValues, callback)
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
    getValue(stateAction, function (value) {
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
    getAll(stateActions, function (stateActionValues) {
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
    db.put(stateActionToString(stateAction), value, function (err) {
      if (err) {
        res.status(500).send('could not save data');
      } else {
        console.log("set value " + value);
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


function stateActionToString(stateAction) {
  var stateString = stateAction.state.reduce(function (a, b) {
    return a.concat(b);
  }, []).join('');
  return stateString + stateAction.action.index + stateAction.action.player
}