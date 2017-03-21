const home = require('./home');
const auth = require('./auth');
const api = require('./api');


module.exports = function(app, db) {
    home(app, db);
    auth(app, db);
    api(app, db);
};