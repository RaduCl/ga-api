var	express = require('express');
var bodyParser = require('body-parser');
var googleAnalytics = require('./googleAnalytics.js');


var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    //res.send("Hello!");
    res.json(googleAnalytics);
});

app.listen(port, function(){
    console.log('App is now running on PORT: ' + port);
});