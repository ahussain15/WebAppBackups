var dogcatfish = require('./dogcatfish.js');
var facts = require('./facts.js');
var apod = require('./apod.js');

module.exports.do_setup = function(app) {
    dogcatfish.run_setup(app);
    facts.run_setup(app);
    apod.run_setup(app);
};

