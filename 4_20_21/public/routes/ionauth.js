var cookieSession = require('cookie-session');
var https = require('https');
const {AuthorizationCode} = require('simple-oauth2');

var options = {headers : {'User-Agent':'request'}};

var ion_client_id = 'o2DF2GQsQMu5SrMDGBNN3fvHwKedwHG5p07SnGQ6';
var ion_client_secret = 'i1T9ALWyS3mqw81u6HXF6YtOtntPfBNtethpYTd5yOvtTqhYrvAfJRF7xIbswgDkTI4sLVrlKfWj5fc9B8jFQiflgqTEGu4IowPC4b7XAmaQbbVuJvMtoIqYXlnZRTCB';
var ion_redirect_uri  = 'https://ahussain.sites.tjhsst.edu/ionauth_login';

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
      res.render('ionauth_login');
  });
  app.get('/ionauth', [/*functions*/], function(req, res){
     var redirect = {"url":authorizationUri};
     console.log("Redirecting to:");
     console.log(redirect.url);
     res.render('ionauth', redirect); 
  });
  
};