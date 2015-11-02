var	express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var bodyParser = require('body-parser');
var googleAnalytics = require('./googleAnalytics.js');
var json2csv = require('json2csv');
var session = require('express-session');

var app = express();

var port = process.env.PORT || 3000;



// jade and stylus compile setup

function compile(str, path){
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
//app.use(express.logger('dev'))
app.use(stylus.middleware(
    { src: __dirname + '/public'
        , compile: compile
    }
))
app.use(express.static(__dirname + '/public'))



//middleware

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//authentification

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));



// Authentication and Authorization Middleware

var auth = function(req, res, next) {
    if (req.session && req.session.user === "radu")
        return next();
    else
        return res.sendStatus(401);
};


//routes

app.get('/', function(req, res){
    if(req.user)
        res.redirect('/dashboard')
    else
        res.redirect('login')
})

app.get('/login', function(req, res){
    //console.log(googleAnalytics.getData);
    //res.send(googleAnalytics.getData);

    //if user is logged in redirect
    if(req.user)
        res.redirect('/dashboard')
    else
        res.render('login',
             {title: 'Login'}
    );
});

app.post('/login', auth)

app.get('/dashboard', function(req, res){
    res.render('dashboard',
        {title: 'Yamaha Dashboard'}
    )
})

// init server
app.listen(port, function(){
    console.log('App is now running on PORT: ' + port);
});