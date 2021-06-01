var cookieSession = require('cookie-session');
var https = require('https');
const {AuthorizationCode} = require('simple-oauth2');

var options = {headers : {'User-Agent':'request'}};

var ion_client_id = 'o2DF2GQsQMu5SrMDGBNN3fvHwKedwHG5p07SnGQ6';
var ion_client_secret = 'i1T9ALWyS3mqw81u6HXF6YtOtntPfBNtethpYTd5yOvtTqhYrvAfJRF7xIbswgDkTI4sLVrlKfWj5fc9B8jFQiflgqTEGu4IowPC4b7XAmaQbbVuJvMtoIqYXlnZRTCB';
var ion_redirect_uri  = 'https://ahussain.sites.tjhsst.edu/ionauth_login';

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
console.log("Ion login link:");
console.log(authorizationUri);

module.exports.run_setup = function(app){
  app.use(cookieSession(
      {
          name: 'ionAuthCookie', keys:['secret']
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
  app.get('/ionauth_login', [translate_code], function(req, res){
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
              res.render('ionauth_login', info);
          });
          response.on('error', function(error){
              console.log('Error');
              console.log(error.message);
          });
      });
  });
  app.get('/ionauth', function(req, res){
     if("loggedin" in req.session && req.session.loggedin == "True"){
         info = req.session.info;
         res.render('ionauth_login', info);
     }
     else{
     var redirect = {"url":authorizationUri};
     console.log("Redirecting to:");
     console.log(redirect.url);
     res.render('ionauth', redirect); 
     }
  });
  app.get('/ionauth_logout', function(req, res){
      req.session.loggedin = "False";
      var redirect = {"url":authorizationUri};
      res.render('ionauth', redirect);
  })
};