//var express = require('express');
//var app = express();
var https = require('https');
var url = "https://api.weather.gov/";
var url_q = url;
var url2 = '';
var options = { headers : { 'User-Agent' : 'request' } } ;
var expressHbs =  require('hbs');
module.exports.run_setup = function(app){
  function func1(req, res, next){
      console.log("At 1");
      var lat = '';
      var long = '';
      if('lat' in req.query && 'long' in req.query && !url_q.includes("points")){
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
      console.log("*** "+url_q);
      https.get(url_q, options , function(response)
      {
        var mid = '';
        response.on('data', function(collect){
            mid += collect;
        });
        response.on('end', function(end){
            console.log(mid);
            mid_json = JSON.parse(mid);
            res.locals.obj = mid_json;
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
      https.get(url2, options, function(response)
    {
        var rawData = '';
        response.on('data', function(collect){
            rawData += collect;
        });
        response.on('end', function(end){
            res.locals.obj2 = JSON.parse(rawData);
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
    var obj2 = res.locals.obj2;
    res.render('weather', [obj, obj2]);
  }
  expressHbs.registerHelper('getTime', function(time) {
  var t = time.slice(11, 16);
  return t;
  });
  app.get('/weather', [func1, func2, func3, func4]);
  
};