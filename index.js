'use strict'
module.change_code = 1;

var Alexa = require('alexa-app');
var skill = new Alexa.app('askpotus');
var TwitterHelper = require('./twitter-helper');

skill.launch(function(req, res) {
    var prompt = "What should I send to POTUS?";
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

skill.intent('tweetAtPotus', {
  'slots': {
    "TWEET": "TWEET_TEXT"
  },
  "utterances":["{What are you doing?|TWEET}"]
},function(req,res) {
  console.log(req.sessionDetails);
  var accessToken = req.sessionDetails.accessToken || null;
  if (accessToken === null) {
    res.linkAccount().shouldEndSession(true).say('Your twitter account is not linked. Check the app');
    return true;
  } else {

    var twitterHelper = new TwitterHelper(req.sessionDetails.accessToken);
    var message = req.slot('TWEET');

    var success = twitterHelper.postTweet('@markmichon ' + message);
    if (success) {
      res.say('Okay, I have sent ' + req.slot('TWEET') + ' to POTUS');
    } else {
      res.say('A problem occured posting that tweet');
    }
     return false;
  }

});

skill.intent('confirmMessage', {
  'slots':
})

module.exports = skill;
