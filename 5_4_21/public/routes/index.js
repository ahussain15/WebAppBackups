var dogcatfish = require('./dogcatfish.js');
var facts = require('./facts.js');
var apod = require('./apod.js');
var weather = require('./weather.js');
var cookie_session = require('./cookie_session.js');
var ionauth = require('./ionauth.js');
var hangman = require('./hangman.js');

module.exports.do_setup = function(app) {
    dogcatfish.run_setup(app);
    facts.run_setup(app);
    apod.run_setup(app);
    weather.run_setup(app);
    cookie_session.run_setup(app);
    ionauth.run_setup(app);
    hangman.run_setup(app);
};

