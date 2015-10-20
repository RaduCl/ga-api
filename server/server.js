var express = require('express');
var bodyParser = require('body-parser');
var analyticsData = require('./googleAnalytics');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    console.log(analyticsData);
    //res.send("Hello from server");
    res.json(analyticsData);
});
app.listen(port, function() {
    console.log('Runnning on PORT ' + port);
});