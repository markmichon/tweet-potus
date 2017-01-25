'use strict';
module.change_code = 1;
var Twitter = require('twit');
var data = require('./data/config');
var CONSUMER_KEY = data.customer_key;
var CONSUMER_SECRET = data.customer_secret;
function TwitterHelper(accessToken) {
  this.accessToken = accessToken.split(',');
  this.client = new Twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token: this.accessToken[0],
    access_token_secret: this.accessToken[1]
  });
}

TwitterHelper.prototype.postTweet = function(message) {
  return this.client.post('statuses/update', {
    status: message
  }).catch(function(err) {
      return false;
    });
};

module.exports = TwitterHelper;
