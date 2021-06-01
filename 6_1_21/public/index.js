var express = require('express');
var routes  = require('./routes');
var app = express();

app.set( 'view engine', 'hbs' ); 
app.get( '/', function(req, res) {

   console.log('user landed at page');
   var obj = {};
   var d = new Date();
   obj.name="Aaliya";
   obj.month=d.getMonth()+1;
   obj.year=d.getFullYear();
   obj.date=d.getDate();
   res.render("index", obj);

} ) ;

routes.do_setup(app); 

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0" , function() {

   console.log("Express server started");

});