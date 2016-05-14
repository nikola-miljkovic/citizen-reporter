var express = require('express'),
  config = require('./config/config'),
  glob = require('glob')/*,
  redis = require('redis'),
  client = redis.createClient();

client.on('connect', function() {
  console.log("redis connected");
}); */

GLOBAL.redisClient = client;

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

