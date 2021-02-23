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

app.get('/facts', function(req, res){
    if('topic' in req.query && 'num' in req.query){
        var obj = {};
        var topic = req.query.topic;
        obj.topic = req.query.topic;
        var num = Number(req.query.num);
        var valid_topics = ['red', 'blue', 'green'];
        if(valid_topics.includes(topic)){
            if(topic == 'red'){
                var facts = ["Strawberries are red when ripe", "Burgundy is a type of red", "Hair can be red", "Some types of leaves turn red in the fall", "When you're sailing and see red skies in the morning, take warning"];
            }
            if(topic == 'blue'){
                var facts = ["Water is very slightly blue", "The Tyndall effect can make suspensions and colloids look blue", "Azure refers to the blue of skies", "If you're feeling blue, I hope your day brightens up :)", "Morning glories come in beautiful hues of blue"];
            }
            if(topic == 'green'){
                var facts = ["Boric acid burns with a green flame", "Chlorophyll gives plants their green colors", "Green apples are a bit tart", "Verdant is a very vivid green", "During the aurora borealis, the horizons of the poles turn green"];
            }
            if(num > 0 && num <= 5){
                obj.facts = facts.slice(0, num);
            }
            if(num > 5){
                obj.facts = facts;
            }
            res.render('facts', obj);
        }
        else{
            res.render('elmo');
        }
    }
    else{
        res.render('elmo');
    }
});

//

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0" , function() {

   console.log("Express server started");

} ) ;

//