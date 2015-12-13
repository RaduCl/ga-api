var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;
var stylus = require('stylus');
var nib = require('nib');

var dbConfig = require('./db');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);//ORM for Schema data like users
var analyticsCollection = dbConfig.collection;
var app = express();


// configuration
function compile(str, path){
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(stylus.middleware(
    { src: __dirname + '/public'
        , compile: compile
    }
))
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({
    secret: '2C23-4D14-WpPQ38S',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


//database feed Cron job

//var cronTime = '00 30 23 * * *';
//var cronTime = '59 * * * * *';//every minute
var cronTime = {
    week: '00 30 23 * * *',//every day @ 23:30
    month: '00 31 23 * * *',//every day @ 23:31
    year: '00 32 23 * * *',//every day @ 23:32
}
var timeZone = 'Europe/Amsterdam'
var dbSeedData = require('./analytics/bidbFeeder')

var getAllDataJob = new CronJob({
    //cronTime: '00 30 23 * * *',//every day @ 23:00
    cronTime: '00 01 00 * * *',
    onTick: function(){
        console.log('Starting ingest cycle CronJob')
        dbSeedData('week',function(){
            dbSeedData('month', function(){
                dbSeedData('year', function(){
                    console.log('ingest CronJob is done');
                })
            })
        })
    },
    start:false,
    timeZone:timeZone
})

getAllDataJob.start()



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;
