var express = require('express');
var mysql = require('mysql');

var cookieSession = require('cookie-session');
var https = require('https');
const {AuthorizationCode} = require('simple-oauth2');

var options = {headers : {'User-Agent':'request'}};

var ion_client_id = 'DYrbCd6H0OXLkWWnh5HNHrFQEO8hIBaWzI7YVoAG';
var ion_client_secret = 'OfrwufXJK6q8LlBiALcF2J0DtelXRZGD2aldhuy86FKcqyLrCspG1ezDIwL99xk4kN8Kmsgv7ofwM4eYmGdTqpDDdRgH7ELBYcFAeX0JODdsmCoZAx4jQI2FdRX54NE7';
var ion_redirect_uri  = 'https://ahussain.sites.tjhsst.edu/sql_login';

var info;

var client = new AuthorizationCode({
  client:{
    id:ion_client_id,
    secret:ion_client_secret,
  } ,
  auth:{
    tokenHost:'https://ion.tjhsst.edu/oauth/',
    authorizePath:'https://ion.tjhsst.edu/oauth/authorize',
    tokenPath:'https://ion.tjhsst.edu/oauth/token/'
  }
});

var authorizationUri = client.authorizeURL({
    scope:'read',
    redirect_uri:ion_redirect_uri
});

var connection = mysql.createConnection({
        host:process.env.DIRECTOR_DATABASE_HOST,
        user:process.env.DIRECTOR_DATABASE_USERNAME,
        password:process.env.DIRECTOR_DATABASE_PASSWORD,
        database:process.env.DIRECTOR_DATABASE_NAME
    });

module.exports.run_setup = function(app){
    app.use(cookieSession(
      {
          name: 'SQLAuthCookie', keys:['secret']
      })); 
      
  async function translate_code(req, res, next){
    var code = req.query.code;
    var options = {
        "code":code, "redirect_uri":ion_redirect_uri, "scope":'read'
    };
    try{
        var accessToken = await client.getToken(options);
        res.locals.token = accessToken.token;
        next();
    }
    catch(error){
        console.log("Error");
        console.log(error.message);
        res.render('elmo');
    }
  }
  app.get('/sql_login', [translate_code], function(req, res){
      var accessToken = res.locals.token.access_token;
      var logged_url = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+accessToken;
      console.log(logged_url);
      req.session.loggedin = "True";
      https.get(logged_url, options, function(response){
          var raw = '';
          response.on('data', function(chunk){
              raw += chunk;
          });
          response.on('end', function(){
              console.log("Raw Info");
              info = JSON.parse(raw);
              console.log(info);
              req.session.info = info;
              res.render('sql_login', info);
          });
          response.on('error', function(error){
              console.log('Error');
              console.log(error.message);
          });
      });
  });
  app.get('/sql', function(req, res){
     var username = "";
     if("loggedin" in req.session && req.session.loggedin == "True"){
         info = req.session.info;
         res.render('sql_login', info);
         username = info.full_name;
     }
     else{
        var redirect = {"url":authorizationUri};
        console.log("Redirecting to:");
        console.log(redirect.url);
        res.render('sql', redirect); 
        username = "guest";
     }
     if("word" in req.query && "number" in req.query){
        var querystring = 'insert into sqlfun(username, word, number) values(?,?,?);';
        connection.query(querystring, [username, req.query.word, req.query.number], function(err, results, fields){
            if(err){
                console.log(err.message);
                res.render('elmo');
            }
        })
     }
  });
  app.get('/sql_logout', function(req, res){
      var username = "guest";
      req.session.loggedin = "False";
      var redirect = {"url":authorizationUri};
      res.render('sql', redirect);
      if("word" in req.query && "number" in req.query){
        var querystring = 'insert into sqlfun(username, word, number) values(?,?,?);';
        connection.query(querystring, [username, req.query.word, req.query.number], function(err, results, fields){
            if(err){
                console.log(err.message);
                res.render('elmo');
            }
        })
      }
  });
};