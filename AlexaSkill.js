'use strict';

var _ = require('lodash');
var rp = require('request-promise');
var request = require('request');

function AlexaSkill() {
}

AlexaSkill.prototype.requestPitneyBowesData = function(theme, cb) {
  return this.getPitneyBowesData(theme, (res) => {
      return cb(res);
  });
};


AlexaSkill.prototype.formatPitneyBowesData = function(pitneyBowesData) {
  console.log('DATA:', pitneyBowesData.themes);
  if(pitneyBowesData.themes.incomeTheme) {
    var ageData = _.template('The average household income is ${averageIncome} in your location.');
    return ageData({
      averageIncome: pitneyBowesData.themes.incomeTheme.individualValueVariable[1].value
    });
  }
  // if(pitneyBowesData.pitneyBowesData.body.themes.incomeTheme) {
  //   var incomeData = _.template('The household median income for ${cityName} is ${mediaIcome}');
  //   return incomeData({
  //     cityName: ResponseDataHere,
  //     medianIncome: ResponseDataHere
  //   });
  // }
};

AlexaSkill.prototype.getPitneyBowesData = function(theme, cb) {
  var geoKey = "AIzaSyAqxqJNg--iGsOxGOpTE6bXiyEsXox-Fmg";

  request.post({
    url: _.template('https://www.googleapis.com/geolocation/v1/geolocate?key=${geoKey}')({
      geoKey: "AIzaSyAqxqJNg--iGsOxGOpTE6bXiyEsXox-Fmg"
    })

  }, (err, res, data) => {

    var location = JSON.parse(data).location;
    var accessToken = "VxAYe59cjn3cClAnWVl82kJk1JAE"

    var apiUrl = _.template('https://api.pitneybowes.com/location-intelligence/geolife/v1/demographics/bylocation?latitude=${lat}&longitude=${lng}&filter=${theme}Theme')({
      lat: location.lat,
      lng: location.lng,
      theme: theme
    });

    request.get({
      url: apiUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }, (err, response, body) => {
      console.log('err',err);
      var stringBody= JSON.parse(body);
      cb(stringBody);
    });
  });
};

module.exports = AlexaSkill;
