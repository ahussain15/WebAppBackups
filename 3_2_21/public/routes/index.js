var dogcatfish = require('./dogcatfish.js');
var facts = require('./facts.js');

module.exports.do_setup = function(app) {
    dogcatfish.run_setup(app);
    facts.run_setup(app);
};

