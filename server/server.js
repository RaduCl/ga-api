var stylus = require('stylus');
var nib = require('nib');
//var googleAnalytics = require('./googleAnalytics.js');
var json2csv = require('json2csv');
var	express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Strategy = require('passport-local').Strategy;
var dbConfig = require('./config/db.js');
mongoose.connect(dbConfig.url);
require('./config/passport')(passport); // pass passport for configuration
//var routes = require('./routes/routes');



// configuration


function compile(str, path){
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(stylus.middleware(
    { src: __dirname + '/public'
        , compile: compile
    }
))
app.use(express.static(__dirname + '/public'))



//middleware

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Configuring Passport

app.use(session({
    secret: '2C23-4D14-WpPQ38S',
    resave: false,
    saveUninitialized: false
}));
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./routes/routes.js')(app, passport);


//passport.use('login-local', new Strategy(
//    {
//        passReqToCallback: true
//    },
//    function(req, username, password, done) {
//        console.log('username: ',username)
//        if (!users[username] || users[username] != password) {
//            return done(null, false);
//        }
//        return done(null, { username : username });
//    }
//));
;

// Authentication and Authorization Middleware

//var auth = function(req, res, next) {
//    console.log(req.session.user)
//    if (req.session && req.session.user === "radu@radu.ro")
//        return next();
//    else
//        return res.sendStatus(401);
//};


//routes

//app.get('/', function(req, res){
//    if(req.user)
//        res.redirect('/dashboard')
//    else
//        res.redirect('login')
//})
//
//app.get('/login', function(req, res){
//    //res.send(googleAnalytics.getData);
//
//    //if user is logged in redirect
//    console.log('get/login')
//    //if(req.user)
//    //    res.redirect('/dashboard')
//    //else
//        res.render('login',
//             {title: 'Login'}
//    );
//});
//
//app.post('/login',
//    //passport.authenticate('local', {
//    //    failureRedirect: '/login',
//    //    succesRedirect: '/dashboard'
//    //})
//
//    //passport.authenticate('login-local', function(err, user){
//    //    console.log('user: '+user);
//    //    if(err) console.log(err);
//    //    if(!user) {return res.redirect('/login')}
//    //    res.end('Authenticated!')
//    //})(req, res)
//    function(req, res){
//        res.redirect('/dashboard')
//    }
//)
//
//app.get('/dashboard', function(req, res){
//    res.render('dashboard',
//        {title: 'Yamaha Dashboard'}
//    )
//})

// init server
app.listen(port, function(){
    console.log('App is now running on PORT: %d in %s mode', port, app.settings.env);
});