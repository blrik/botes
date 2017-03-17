//start
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./app/db');
const mongoClient = require('mongodb').MongoClient;
const app = express();

app.locals.project = 'botes';
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(express.static('./app/public'));


//start
mongoClient.connect(db.url, function(err, database) {
    if (err) return console.log(err)

    //routes  
    require('./app/routes')(app, database);

    //error
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json(err);
    });

    //start
    app.listen(app.get('port'), function() {
        console.log('server start on port ' + app.get('port') + ' in ' + app.get('env') + ' mode at ' + (new Date).toLocaleTimeString());
    });
});