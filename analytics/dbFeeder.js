var gaData = require('../models/AnalyticsData')
var dbConfig = require('../db');
var url = dbConfig.url;
var db = require('mongoskin').db(url);
//var db = require('mongoskin').db('mongodb://localhost/test');

var analyticsData = db.collection('analyticsData').findOne(function(err, result) {
    if (err) throw err;
    //db.createCollection('analyticsData')
    console.log(result);
});

//var analyticsData = db.collection('analyticsData').find({});
//analyticsData.each(function(err, band) {
//    console.log(band);
//});

/* GET  google all analytics data */
var getAanalyticsData = function(){

    //get the parametrized partial query objects
    var queries = require('../analytics/AnalyticsQueries')
    //get the google-analytics authentication module
    var googleAnalytics = require('../analytics/googleAnalytics2').getAllData;

    var JSONobj = {};
    var curentDate = setToday();
    var timeInterval = '';//week or month time interval
    JSONobj = {
        curentDate: curentDate,
        timeInterval: timeInterval
    }
    var data = {};

    var i=0;
    var queryLength = Object.keys(queries).length;

    //return date format 2015-05-24
    var setToday = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        return today = yyyy+'-'+mm+'-'+dd;
    }

    //run all analytics queries
    for(var q in queries){
        googleAnalytics(function (err, result, queryKey){

            if(err) return console.log(err)
            if(result){

                //rename object key with the query key
                data[queryKey] = result.rows
                i++;
            }
            if(i==queryLength)
            {
                console.log(data)
                JSONobj[analyticsData] = data;
                return JSONobj
                //res.send(data)
            }
        }, queries[q], q)
    }
};

//getAanalyticsData();
//module.exports = getAanalyticsData;