//var async = require('async')
var Q = require('q');
var dbConfig = require('../db');
var url = dbConfig.url;
var collection = dbConfig.collection;
var db = require('mongoskin').db(url);


/* GET  google all analytics data */
var getAnalyticsData = function(period, callback){
    //get the parametrized partial query objects
    var queries = require('../analytics/AnalyticsQueries')(period)

    //get the google-analytics authentication module
    var googleAnalytics = require('../analytics/googleAnalytics2').getAllData;

    var JSONobj = {};
    var createDate = Date().slice(0, 15);
    JSONobj = {
        createDate: createDate,
        timeInterval: period,
        Data: {},
    }
    var data = {};

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
        //get googleAnalytics data
        setTimeout(function(){
            var i = loop.iteration();
            //process implmentation
            var q = queryKeys[i];
            console.log('getting results for: ' + q + 'interval: ' + period);
            function callBack(err, result, queryKey) {
                if (err)  console.log(err)
                if (result) {
                    //rename object key with the query key
                    data[queryKey] = result.rows
                    loop.next();
                }
            }
            googleAnalytics(callBack, queries[q], q)
        }, 110);
    }, function(){
        //get appStoreData
        var AppStoreData = require('../analytics/AppStoreAnalytics')
        AppStoreData.getAppStoreData(period, function(result){
            if(result){
                console.log('getting results for: appStoreDownloads')
                data['appStoreDownloads'] = result;
                AppStoreData.getAppStoreDataByCountry(period, function(result){
                    if(result){
                        console.log('getting results for: appStoreDownloadsByCountry')
                        data['appStoreDownloadsByCountry'] = result;
                        JSONobj.Data = data;
                        db.collection(collection).insert(JSONobj, function(err, result) {
                            //db.collection('analytics').drop();
                            db.close();
                            if(err) return err
                            if(callback){
                                console.log('intru in callback: ');
                                callback()
                            }
                        });
                    }
                })
            }
        })
        AppStoreData.getAppStoreDataByCountry(period, function(result){
            if(result){
                console.log('getting results for: getAppStoreDataByCountry')
                data['getAppStoreDataByCountry'] = result;
                JSONobj.Data = data;
                db.collection(collection).insert(JSONobj, function(err, result) {
                    //db.collection('analytics').drop();
                    db.close();
                    if(err) return err
                    if(callback){
                        console.log('intru in callback: ');
                        callback()
                    }
                });
            }
        })
    });
};

// for manualy feed db run CLI command "node dbFeeder.js week" week/month/year param is necesary to set the timeInterval for analytics API queries
if(process.argv[2]){
    getAnalyticsData(process.argv[2]);
}

module.exports = getAnalyticsData;