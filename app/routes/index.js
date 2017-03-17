const home = require('./home');
const api = require('./api');


module.exports = function(app, db) {
    home(app, db);
    api(app, db);
};