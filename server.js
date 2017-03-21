

//config
const config = require('./config');


//start
const express = require('express');
const app = express();
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const mongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const connectMongo = require('connect-mongo')(expressSession);
const store = new connectMongo({
    url: config.url,
    collection: 'sessions'
});


app.set('port', process.env.PORT || 8000);
app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//session
app.use(expressSession({
    secret: config.secret,
    store: store,
    resave: false,
    saveUninitialized: true,
    name: 'botes',
    cookie: {
        maxAge: new Date(Date.now() + 3600000 * 24 * 21)
    }
}));
app.use(connectFlash());


//connect
mongoClient.connect(config.url, function(err, database) {
    if (err) return console.log(err);

    //passport
    app.use(passport.initialize());
    app.use(passport.session());
    require('./config/passport')(passport);

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