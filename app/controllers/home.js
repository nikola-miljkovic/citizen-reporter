var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

var search = function(query) {
  
}

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Generator-Express MVC'
  });
});

router.get('/search', function(req,res,next) {
  res.render('searchbox');
});

router.post('/search', function(req,res,next) {
  console.log(req.body);
  var res_ = res;
  var request = require('request');

  var client = {
    consumer_key: 'W0Pk5iyZKGlWC3TbhUPo9GLNH',
    consumer_secret: '8XA8w0qmOIr8DEfsmgvyFPmE97n1E3FZTLG3FNEmgGXVrJJDic',
  };

  request.post('https://api.twitter.com/oauth2/token', {
    form: {
      grant_type: 'client_credentials',
    },
    auth: {
      'user': client.consumer_key,
      'password': client.consumer_secret
    }
  }, function (err, res, body) {
    console.log(JSON.parse(body));
    var raw = JSON.parse(body);
    var access_token = raw['access_token'];

    request.get('https://api.twitter.com/1.1/search/tweets.json?q=%23' + req.body.tags, {
      headers: {
                    Authorization: 'Bearer ' + access_token
                  }
                },  function (err, res, body) {
                  var b = JSON.parse(body);
                  var filtered = [];
                  b.statuses.forEach(function(status) {
                    filtered.push({
                      id: status.id,
                      text: status.text,
                      user_id: status.user.id,
                      media:  status.media !== undefined ? status.media[0].media_url : ""
                    })
                  })
                  GLOBAL.redisClient.publish('tweet_feed', JSON.stringify(filtered));
                  res_.send(filtered);
                });
  });
});