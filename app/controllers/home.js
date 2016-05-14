var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/', router);
};

var search = function(query) {
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

  request.get('https://api.twitter.com/1.1/search/tweets.json?q=%23' + query, {
    headers: {
                  Authorization: 'Bearer ' + access_token
                }
              },  function (err, res, body) {
                console.log(body);
              });
});
}

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});

router.get('/search', function(req,res,next) {
  res.render('searchbox');
});

router.post('/search', function(req,res,next) {
  console.log(req.body);
  
});