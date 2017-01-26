var alexa = require('alexa-app');
var app = new alexa.app('askpotus');
var router = require('alexa-app-router');
var TwitterHelper = require('./twitter-helper');
var questions = require('./data/questions');
var accessToken;
var savedTweet;
var config = {
  defaultRoute: '/',
  pre: preHandler,
  launch: launchHandler
};

var intents = {
  TweetIntent: {
    'slots': {'TWEET': 'TWEET_TEXT'},
    'utterances': ['{TWEET}']
  },
  'RandomQuestion': {
    'utterances': ['random']
  }
}
var routes = {
  '/': {
    'AMAZON.StopIntent': exitHandler,
    'TweetIntent': captureHandler,
    'AMAZON.YesIntent': confirmHandler,
    'AMAZON.NoIntent': launchHandler,
    'RandomQuestion': questionHandler
  }
}

router.addRouter(app, config, intents, routes);

exports.handler = app.lambda();
exports.alexa = app;

function preHandler(request, response) {
  accessToken = request.sessionDetails.accessToken;
  if (!accessToken) {
    response.linkAccount();
    response.say('Please link your account in the Alexa app').send();
    return false;
  }
  console.log('Token Found!');
  console.log(request.data.request.intent);
  return true;
}

function launchHandler(request, response) {
  console.log('app.launch');
  var text = "Okay, what should I tweet to POTUS? Say random for a random question from the U.S. Citizenship test."
  response
    .say(text)
    .route('/')
    .send();
}

function captureHandler(request, response) {
  console.log(request.data.request.intent);
  var message = request.slot('TWEET');
  console.log('Saving ', message);
  savedTweet = message;
  var text = 'Is "' + message + '" correct?';
  response
    .say(text)
    .route('/')
    .send();
}

function questionHandler(request, response) {
  var message = getQuestion(questions);
  savedTweet = message;
  var text = "Okay, I'll ask: " + message + ". Is that okay?";
  response
    .say(text)
    .route('/')
    .send();
}

function confirmHandler(request, response) {
  console.log(request.data.request.intent);
  var message = savedTweet;
  console.log('Sending Tweet')
  console.log(message);

  var twitterHelper = new TwitterHelper(accessToken);
  twitterHelper.postTweet('@markmichon ' + message, function(status) {
    console.log(status);
    response
    .say(status)
    .send();
  });
  return false;
}

function exitHandler(request, response) {
  console.log('app.end');
}


function getRandom(min, max) {
  return Math.floor(Math.random() * (max-min) + min);
}

function getQuestion(array) {
  let index = getRandom(0, array.length);
  return array[index];
}
module.exports = app;
