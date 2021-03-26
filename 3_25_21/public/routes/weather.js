var express = require('express');
var app = express();
var url = "https://api.weather.gov/";
var url_q = url;
var url2 = '';
var https = require('https');

module.exports.run_setup = function(app){
  app.get('/weather', [func1, func2, func3, func4]);
  function func1(req, res, next){
      var lat = '';
      var long = '';
      if('lat' in req.query && 'long' in req.query && !url_q.includes("lat")){
          lat = req.query.lat;
          long = req.query.long;
          url_q += "points/" + lat + ',' + long;
          console.log("1 done");
          console.log(url_q);
          next();
      }
      else{
          res.render('elmo');
          url_q = url;
      }
  }
  function func2(req, res, next){
      https.get(url_q, function(response)
      {
        var mid = '';
        response.on('data', function(collect){
            mid += collect;
        });
        response.on('end', function(end){
            mid_json = JSON.parse(mid);
            url2 = mid_json.properties.forecastHourly;
            next();
        });
        response.on('error', function(error){
            res.render('elmo');
            url_q = url;
        });
      });
  }
  function func3(req, res, next){
      console.log('At 3');
      url_q = url;
      https.get(url2, function(response)
    {
        var rawData = '';
        response.on('data', function(collect){
            rawData += collect;
        });
        response.on('end', function(end){
            res.locals.obj = JSON.parse(rawData);
            console.log("3 done");
            next(); 
        });
        response.on('error', function(error){
            res.render('elmo');
        });
    });
  }
  function func4(req, res){
    var obj = res.locals.obj;
    res.render('weather', obj);
  }
};