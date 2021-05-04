var express = require('express');

module.exports.run_setup = function(app){
    app.get('/hangman', function(req, res){
        res.render('hangman');
    });
};