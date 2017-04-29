module.exports = function(app, db) {
    app.get('/', function(req, res) {
        if (req.isUnauthenticated()) {
            res.redirect('/auth');
            return;
        }
        res.render('app', {
            page_title: 'botes',
            page_id: 'home',
            user: req.user,
        });
    });
};