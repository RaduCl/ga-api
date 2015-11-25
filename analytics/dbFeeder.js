//var async = require('async')
//var Q = require('q');
var dbConfig = require('../db');
var url = dbConfig.url;
var collection = dbConfig.collection;
var db = require('mongoskin').db(url);

//RUN this script in console: node dbFeeder.js week[month]

/* GET  google all analytics data */
var getAanalyticsData = function(period){
    console.log('process.argv[2]' + process.argv[2]);
    //get the parametrized partial query objects
    var queries = require('../analytics/AnalyticsQueries')('year')

    //get the google-analytics authentication module
    var googleAnalytics = require('../analytics/googleAnalytics2').getAllData;

    var JSONobj = {};
    var createDate = Date().slice(0, 15);
    var timeInterval = 'month';//week or month time interval
    JSONobj = {
        createDate: createDate,
        timeInterval: period,
        Data: {},
    }
    var data = {};

    //var i=0;
    var queryLength = Object.keys(queries).length;
    var queryKeys = Object.keys(queries).map(function(keyName, index){
        return keyName;
    })

    function syncLoop(iterations, process, exit){
        var index = 0,
            done = false,
            shouldExit = false;
        var loop = {
            next:function(){
                if(done){
                    if(shouldExit && exit){
                        return exit(); // Exit if we're done
                    }
                }
                // If we're not finished
                if(index < iterations){
                    index++; // Increment our index
                    process(loop); // Run our process, pass in the loop
                    // Otherwise we're done
                } else {
                    done = true; // Make sure we say we're done
                    if(exit) exit(); // Call the callback on exit
                }
            },
            iteration:function(){
                return index - 1; // Return the loop number we're on
            },
            break:function(end){
                done = true; // End the loop
                shouldExit = end; // Passing end as true means we still call the exit callback
            }
        };
        loop.next();
        return loop;
    }

    //run all analytics queries
    syncLoop(queryLength, function(loop){
        setTimeout(function(){
            var i = loop.iteration();
            //console.log(i);
            //process implmentation
            var q = queryKeys[i];
            console.log('getting results for: ' + q);
            function callBack(err, result, queryKey) {
                //console.log("iul este: " + i)
                if (err)  console.log(err)
                if (result) {
                    //rename object key with the query key
                    data[queryKey] = result.rows
                    loop.next();
                }
            }
            googleAnalytics(callBack, queries[q], q)
            //loop.next();
        }, 110);
    }, function(){
        //console.log('done data is: ' + data);
        JSONobj.Data = data;
        //console.log(JSON.stringify(JSONobj))
        db.collection(collection).insert(JSONobj, function(err, result) {
            //console.log(result);
            //db.collection('analytics').drop();
            db.close();
        });
    });
};

getAanalyticsData(process.argv[2]);
//module.exports = getAanalyticsData;