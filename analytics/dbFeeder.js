var q = require('q');
var dbConfig = require('../db');
var url = dbConfig.url;
var db = require('mongoskin').db(url);

/* GET  google all analytics data */

var getAanalyticsData = function(period){
    console.log('process.argv[2]' + process.argv[2]);
    //get the parametrized partial query objects
    var queries = require('../analytics/AnalyticsQueries')
    //get the google-analytics authentication module
    var googleAnalytics = require('../analytics/googleAnalytics2').getAllData;

    var JSONobj = {};
    var createDate = Date();
    var timeInterval = 'month';//week or month time interval
    JSONobj = {
        createDate: createDate,
        timeInterval: period,
        Data: {},
    }
    var data = {};

    var i=0;
    var queryLength = Object.keys(queries).length;

    //run all analytics queries
    for(var q in queries){
        i++;

        function callBack(err, result, queryKey){
            console.log("iul este: " + i)
            if(err) return console.log(err)
            if(result){
                //rename object key with the query key
                data[queryKey] = result.rows
                //i++;
            }

            if(i==queryLength)
            {
                JSONobj.Data = data;
                console.log(JSON.stringify(JSONobj))
                db.collection('analytics').insert(JSONobj, function(err, result) {
                    console.log(result);
                    //db.collection('analytics').drop();
                    db.close();
                });
            }
        }

        (function(cb, queries, q, i){
            setTimeout(function(){googleAnalytics(cb, queries, q)}, 200*i);
            })(callBack, queries[q], q, i)
    }

};

getAanalyticsData(process.argv[2]);
//module.exports = getAanalyticsData;