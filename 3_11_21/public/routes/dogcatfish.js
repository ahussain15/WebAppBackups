var express = require('express');
var app = express();
module.exports.run_setup = function(app) {
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
};
