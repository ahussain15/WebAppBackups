var express = require('express');
//var app = express();
var url = 'https://api.nasa.gov/planetary/apod?api_key=mb8kgV3FjXqakbvX5UwbLFlJ8HM85we30F8Yfzf6';
var url_q = url;
var https = require('https');
module.exports.run_setup = function(app) {
app.get('/apod', [func1, func2]);
function func1(req, res, next){
    if('date' in req.query){
        url_q += '&date='+req.query.date;
    }
    https.get(url_q, function(response)
    {
        var rawData = '';
        response.on('data', function(collect){
            rawData += collect;
        });
        response.on('end', function(end){
            res.locals.obj = JSON.parse(rawData);
            url_q = url;
            next(); 
        });
        response.on('error', function(error){
            res.render('elmo');
        });
    });
}
function func2(req, res){
    var obj = res.locals.obj;
    res.render('apod', obj);
}
};