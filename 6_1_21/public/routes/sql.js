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
              res.redirect('/sql');
          });
          response.on('error', function(error){
              console.log('Error');
              console.log(error.message);
          });
      });
  });
  app.get('/sql', function(req, res){
     var username = "";
     var other_words = "";
     var other_numbers = "";
     var connection = mysql.createConnection({
        host:process.env.DIRECTOR_DATABASE_HOST,
        user:process.env.DIRECTOR_DATABASE_USERNAME,
        password:process.env.DIRECTOR_DATABASE_PASSWORD,
        database:process.env.DIRECTOR_DATABASE_NAME
    });
     if("loggedin" in req.session && req.session.loggedin == "True"){
        info = req.session.info;
        username = info.full_name;
        var querystring2 = 'select word from sqlfun where username=?';
        connection.query(querystring2, [username], function(err, results, fields){
            if(err){
                console.log(err.message);
                res.render('elmo');
            }
            if(results.length > 0){
                for(i = 0; i < results.length; i++){
                    other_words = other_words + " " + JSON.parse(JSON.stringify(results[i])).word;
                }
                console.log("Other Words");
                console.log(other_words);
            }
        })
        var querystring3 = 'select number from sqlfun where username=?';
        connection.query(querystring3, [username], function(err, results, fields){
            if(err){
                console.log(err.message);
                res.render('elmo');
            }
            if(results.length > 0){
                for(i = 0; i < results.length; i++){
                    other_numbers = other_numbers + " " + JSON.parse(JSON.stringify(results[i])).number;
                }
            }
            var obj = {'info':info, 'words':other_words, 'numbers':other_numbers};
            console.log(obj);
            res.render('sql_login', obj);
        })
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
        if(username != "guest"){
        querystring2 = 'select word from sqlfun where username=?';
        connection.query(querystring2, [username], function(err, results, fields){
            if(err){
                console.log(err.message);
                res.render('elmo');
            }
            if(results.length > 0){
                for(i = 0; i < results.length; i++){
                    other_words = other_words + " " + JSON.parse(JSON.stringify(results[i])).word;
                }
                console.log("Other Words");
                console.log(other_words);
            }
        })
        querystring3 = 'select number from sqlfun where username=?';
        connection.query(querystring3, [username], function(err, results, fields){
            if(err){
                console.log(err.message);
                res.render('elmo');
            }
            if(results.length > 0){
                for(i = 0; i < results.length; i++){
                    other_numbers = other_numbers + " " + JSON.parse(JSON.stringify(results[i])).number;
                }
            }
            var obj = {'info':info, 'words':other_words, 'numbers':other_numbers};
            console.log(obj);
            res.render('sql_login', obj);
        })
        }
     }
  });
  app.get('/sql_logout', function(req, res){
      var username = "guest";
      req.session.loggedin = "False";
      var redirect = {"url":authorizationUri};
      res.render('sql', redirect);
      var connection = mysql.createConnection({
        host:process.env.DIRECTOR_DATABASE_HOST,
        user:process.env.DIRECTOR_DATABASE_USERNAME,
        password:process.env.DIRECTOR_DATABASE_PASSWORD,
        database:process.env.DIRECTOR_DATABASE_NAME
        });
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