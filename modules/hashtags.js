var redis = require('redis').createClient();

var fnc = function() {
  var request = require('request');

  var client = {
    consumer_key: 'W0Pk5iyZKGlWC3TbhUPo9GLNH',
    consumer_secret: '8XA8w0qmOIr8DEfsmgvyFPmE97n1E3FZTLG3FNEmgGXVrJJDic',
  };

  request.post('https://api.twitter.com/oauth2/token',
  {
    form: {
      grant_type: 'client_credentials',
    },
    auth: {
      'user': client.consumer_key,
      'password': client.consumer_secret
    }
  },
  function (err, res, body) {
    console.log(JSON.parse(body));
    var raw = JSON.parse(body);
    var access_token = raw['access_token'];

  request.get('https://api.twitter.com/1.1/trends/place.json?id=2450022', {
    headers: { Authorization: 'Bearer ' + access_token }
    },
    function (err, res, body) {
        var b = JSON.parse(body);
        var filtered = [];
        b[0].trends.forEach(function(data) {
          if (data.name[0] !== '#') return;
           filtered.push(data.name);
        })

        redis.set('trending:us', JSON.stringify(filtered));
        console.log(filtered);

        filtered.forEach(function(tag) {
          console.log('Fetching...' + tag);
          var query = 'https://api.twitter.com/1.1/search/tweets.json?q=' + tag.replace('#', '%23') + '&count=3';
          request.get(query, {
            headers: {
              Authorization: 'Bearer ' + access_token
            }
          },  function (err, res, body) {
                  var bd = JSON.parse(body);
                  var filt = [];

                  bd.statuses.forEach(function(status) {
                    filt.push({
                      id: status.id,
                      text: status.text,
                      user_id: status.user.id,
                      media:  status.media !== undefined ? status.media[0].media_url : ""
                    });
                  });

                  console.log('Data for tag: ' + tag + '\n' + filt + '\n');
                  redis.set('tag:' + tag , JSON.stringify(filt));
              });
        });

        redis.publish('trending_updated', 'updated');
  });
});
};

fnc();
setInterval(fnc, 20*60000);
