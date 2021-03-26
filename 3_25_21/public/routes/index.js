var dogcatfish = require('./dogcatfish.js');
var facts = require('./facts.js');
var apod = require('./apod.js');
var weather = require('./weather.js')

module.exports.do_setup = function(app) {
    dogcatfish.run_setup(app);
    facts.run_setup(app);
    apod.run_setup(app);
    weather.run_setup(app);
};

