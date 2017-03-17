module.exports = function(app, db) {
    
    app.get('/', function(req, res) {
        res.render('layout', {
            page_title: 'Home',
            page_ID: 'home'
        });
    });
};