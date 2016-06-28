var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var levelup = require('levelup');
var db = levelup('./db');
var bodyParser = require('body-parser')

var app = express();
var compiler = webpack(config);

app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.post('/q-learning/get', function (req, res) {
  let body = req.body;
  let stateAction = body.stateAction;
  if (stateAction) {
    db.get(stateActionToString(stateAction), function (err, value) {
      if (err) {
        res.status(200).json(JSON.stringify({value: 0.5}));
      } else {
        console.log('found ' + stateAction + ' = ' + value);
        res.status(200).json(JSON.stringify({value: value}));
      }
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
        console.log('saved ' + stateAction + ' = ' + value);
        res.status(200).send();
      }
    });
  } else {
    res.status(400).send('parameter key needed');
  }
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
  
app.listen(3000, 'localhost', function (err, result) {
  if (err) console.log(err);
  console.log('Listening at localhost:3000');
});


function stateActionToString(stateAction) {
  var stateString = stateAction.state.reduce(function(a, b) {
    return a.concat(b);
  }, []).join('');
  return stateString + stateAction.action.index + stateAction.action.player
}