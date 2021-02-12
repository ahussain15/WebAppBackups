var express = require('express');

var app = express();

//
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
app.get('/fish', function(req, res){
    res.render("fish");
});
app.get('/dog', function(req, res){
    res.render("dog");
});
app.get('/cat', function(req, res){
    res.render("cat");
});

app.get('/pet', function(req, res){
    if('type' in req.query){
        var type = req.query.type;
        if(type == "dog"){
            res.render("dog");
        }
        else{
            if(type=="cat"){
            res.render("cat");
            }
            else{
                res.render("elmo");
            }
        }
    }
}
);

//

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0" , function() {

   console.log("Express server started");

} ) ;

//