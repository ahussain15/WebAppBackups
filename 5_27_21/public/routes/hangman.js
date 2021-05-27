var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host:process.env.DIRECTOR_DATABASE_HOST,
    user:process.env.DIRECTOR_DATABASE_USERNAME,
    password:process.env.DIRECTOR_DATABASE_PASSWORD,
    database:process.env.DIRECTOR_DATABASE_NAME
});

module.exports.run_setup = function(app){
    app.get('/hangman', function(req, res){
        var username = 'guest';
        res.render('hangman');
        console.log('rendered page');
        if('word' in req.query && 'outcome' in req.query){
            console.log('passed if');
            var querystring = 'insert into hangman(username, word, outcome) values(?,?,?);';
            connection.query(querystring, [username, req.query.word, req.query.outcome], function(err, results, fields){
            console.log("Entered outcome");
            if(err){
                console.log(err.message);
                res.render('elmo');
                }
            });
        }
    });
};