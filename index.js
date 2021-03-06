'use strict';
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('geolife');
var AlexaSkill = require('./AlexaSkill');
var APP_ID = "arn:aws:lambda:us-east-1:231681499584:function:OurApp";

app.launch(function(req, res) {
  var prompt = 'Welcome to the GeoLife Infomational Center, what would you like to know?';
  var reprompt = '';
  res.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

app.intent('geolife', {
  'slots': {
    "THEMES": "AMAZON.LITERAL"
  },
  'utterances': ['{search|find|get} {|location|my} {income|THEMES}']
},
  function(req, res) {
    var theme = req.slot('THEMES');
    var reprompt = 'Bro u gotta tell me what you wanna know!';
    if(_.isEmpty(theme)) {
      var prompt = 'I can\'t hear ya!';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var alexaSkill = new AlexaSkill();
      alexaSkill.requestPitneyBowesData(theme, function(themeData) {
        console.log(themeData);
        res.say(alexaSkill.formatPitneyBowesData(themeData)).send();
      });
      return false;
    }
  }
);

console.log((app.utterances().replace(/\{\-\|/g, '{')));
module.exports = app;
