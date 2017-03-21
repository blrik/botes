const passport = require('passport');


module.exports = function(app) {
    app.get('/auth', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/');
            return;
        }
        res.json('go to: /auth/vk');
    });
    app.get('/auth/vk', passport.authenticate('vkontakte'));
    app.get('/auth/callback', passport.authenticate('vkontakte', {
        successRedirect: '/',
        failureRedirect: '/auth'
    }));
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/auth');
    });
};