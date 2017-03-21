module.exports = function(app, db) {
    app.get('/', function(req, res) {
        if (req.isUnauthenticated()) {
            res.redirect('/auth');
            return;
        }
        res.render('layout', {
            page_title: 'Botes',
            page_id: 'home',
            user: req.user,
        });
    });
};