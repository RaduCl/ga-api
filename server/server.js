var	express = require('express')
var stylus = require('stylus')
var nib = require('nib')
var bodyParser = require('body-parser')
var googleAnalytics = require('./googleAnalytics.js')
var json2csv = require('json2csv')
//var path = require('path')

//var html_dir = path.resolve('../dashboard/deploy/');
//var css_dir = path.resolve('../dashboard/deploy/styles');

var app = express();

var port = process.env.PORT || 3000;

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

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    //console.log(googleAnalytics.getData);
    //res.send(googleAnalytics.getData);
    res.render('dashboard',
        {title: 'Login'}
    );
});

app.listen(port, function(){
    console.log('App is now running on PORT: ' + port);
});