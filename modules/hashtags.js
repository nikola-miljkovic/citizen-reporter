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
          var query = 'https://api.twitter.com/1.1/search/tweets.json?q=' + tag.replace('#', '%23') + '&count=100&locale=us';
          request.get(query, {
            headers: {
              Authorization: 'Bearer ' + access_token
            }
          },  function (err, res, body) {
                  var bd = JSON.parse(body);
                  var filt = [];

                  bd.statuses.forEach(function(status) {
                    if (status.retweeted_status !== undefined || status.text.length < 30 || status.lang !== 'en')
                      return;

                    var quality = 0.0;

                    if (status.text.length > 55)
                      quality += 0.20;
                    if (status.entities.user_mentions.length === 0)
                      quality += 0.20;
                    if (status.entities.urls.length === 0)
                      quality += 0.20;
                    if (status.favorite_count > 1)
                      quality += 0.10;
                    if (status.favorite_count > 20)
                      quality += 0.10;
                    if (status.verified === true)
                      quality += 0.20;

                    if (quality < 0.40)
                      return;

                    filt.push({
                      id: status.id,
                      text: status.text.replace('\t', ' ').replace('\n',' ').replace('@', 'at '),
                      user_id: status.user.id,
                      media:  status.entities.media !== undefined ? status.entities.media[0].media_url : ""
                    });
                  });

                  console.log('Data for tag: ' + tag + '\n' + filt + '\n');
                  console.log('TOTAL COUNT: ' + filt.length);
                  redis.set('tag:' + tag , JSON.stringify(filt));
              });
        });

        redis.publish('trending_updated', 'updated');
  });
});
};

redis.publish('test', 'testing');
fnc();
setInterval(fnc, 20*60000);
