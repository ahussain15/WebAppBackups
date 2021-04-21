var express = require('express');
var cookieSession = require('cookie-session');
module.exports.run_setup = function(app){
    app.use(cookieSession({
        name : 'counterCookie', keys : ['secret']
    })) ;
 app.get('/cookie_session', function( req , res ) {
     var visitCounter;
     if('visitCounter' in req.session && !('reset' in req.query)){
         visitCounter = req.session.visitCounter + 1;
     }
     else{
         visitCounter = 1;
     }
     req.session.visitCounter = visitCounter;
     var obj = {'visitCounter':req.session.visitCounter};
     console.log("obj");
     console.log(obj);
     res.render("cookie", obj);
 });
};