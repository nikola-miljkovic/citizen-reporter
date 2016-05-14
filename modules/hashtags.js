var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'W0Pk5iyZKGlWC3TbhUPo9GLNH',
  consumer_secret: '8XA8w0qmOIr8DEfsmgvyFPmE97n1E3FZTLG3FNEmgGXVrJJDic',
  access_token_key: ' 346040407-9W2zJGsTfiyc1pG0EDndOoWqYCfKyy6WIigGeK96',
  access_token_secret: ' 2DPpSwssgKNgle9oPnJgm8jtdcgRRFwE1pomPtY5mUw0G'
});

client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response){
   console.log(tweets);
});
