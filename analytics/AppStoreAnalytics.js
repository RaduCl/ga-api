var itc = require("itunesconnect");
var Report = itc.Report;
var Q = require('q');
var prettyjson = require('prettyjson')
// Connect to iTunes
var itunes = new itc.Connect('connectstats@indg.com', 'Dsc729max!');


//helper method for getting deference between current and previous time interval in percents
var getDeltaPercentage = function(currentResult, prevResult){
    if((prevResult)){
        return Math.floor((currentResult-prevResult)/prevResult*100);
    } else return('-')};

var getAppStoreDataByCountryTemp = function(interval, country){
    var deferred = Q.defer();
    var finalRes = {}
    var country = country
    itunes.request(Report.ranked().time(1, interval+"s").location(country), function (error, result) {
        console.log('starting ' + country);
        console.log(country);
        if(error) deferred.reject(error)
        if(result){
            result.map(function(app){
                var rObj = {}
                rObj['downloads'] = app.units
                finalRes[app.title.replace(/ /gi, '')] = rObj
            })

            itunes.request(Report.ranked().time(2, interval+"s").location(country), function (error, result) {
                if(error) return callback(error)
                if(result){
                    result.map(function(app){

                        finalRes[app.title.replace(/ /gi, '')].previousDownloads = app.units - finalRes[app.title.replace(/ /gi, '')].downloads
                        finalRes[app.title.replace(/ /gi, '')].delta = finalRes[app.title.replace(/ /gi, '')].downloads - finalRes[app.title.replace(/ /gi, '')].previousDownloads
                        finalRes[app.title.replace(/ /gi, '')].deltaPercentage = getDeltaPercentage(finalRes[app.title.replace(/ /gi, '')].downloads, finalRes[app.title.replace(/ /gi, '')].previousDownloads )
                        finalRes[app.title.replace(/ /gi, '')].country = country
                    })
                    deferred.resolve(finalRes)
                    console.log(finalRes);
                    //if(callback) callback(finalRes)
                }
            })
        }
    })
    return deferred.promise
}

var getAppStoreDataByCountry = function(interval){
    var countryKeys = {
        'Italy' : 143450,
        'Spain' : 143454,
        'France' : 143442,
        'Germany' : 143443,
        'UK' : 143444
    }
    console.log('starting');
    var rObj = {
        MyGarageSportHeritage: {},
        MyGarageMT: {},
        MyGarageSupersport: {}
    }


    var t = Object.keys(countryKeys).map(function(country){
        getAppStoreDataByCountryTemp(interval, countryKeys[country])
            .then(function(data){
                Object.keys(data).map(function(app){
                    rObj[app][country] = data[app]
                })
                console.log('\n'+prettyjson.render(rObj));
            })
    })
    //for(var country in countryKeys){
    //    getAppStoreDataByCountryTemp(interval, )
    //    .then(function(data){
    //        Object.keys(data).map(function(app){
    //            rObj[app][arguments[1]] = data[app]
    //        })
    //        console.log('\n'+prettyjson.render(rObj));
    //    })
    //}

    //getAppStoreDataByCountryTemp(interval, 'Spain')
    //.then(function(data){
    //    Object.keys(data).map(function(app){
    //        rObj[app][arguments[1]] = data[app]
    //    })
    //    console.log('\n'+prettyjson.render(rObj));
    //})
    //getAppStoreDataByCountryTemp(interval, 'Italy')
    //.then(function(data){
    //    Object.keys(data).map(function(app){
    //        rObj[app]['Italy'] = data[app]
    //    })
    //    console.log('\n'+prettyjson.render(rObj));
    //
    //})
    //getAppStoreDataByCountryTemp(interval, 'Germany')
    //.then(function(data){
    //    Object.keys(data).map(function(app){
    //        rObj[app]['Germany'] = data[app]
    //    })
    //    console.log('\n'+prettyjson.render(rObj));
    //
    //})
    //getAppStoreDataByCountryTemp(interval, 'France')
    //.then(function(data){
    //    Object.keys(data).map(function(app){
    //        rObj[app]['France'] = data[app]
    //    })
    //    console.log('\n'+prettyjson.render(rObj));
    //
    //})
}


//var getAppStoreDataByCountry = function(interval, callback){
//    console.log('starting');
//    var rObj = {
//        MyGarageSportHeritage: {},
//        MyGarageMT: {},
//        MyGarageSupersport: {}
//    }
//    getAppStoreDataByCountryTemp(interval, 'Spain', function(data){
//        var apps = Object.keys(data)
//        apps.map(function(app){
//            rObj[app]['Spain'] = (data[app])
//        })
//        //console.log('\n'+prettyjson.render(rObj));
//        getAppStoreDataByCountryTemp(interval, 'Italy', function(data){
//            var apps = Object.keys(data)
//            apps.map(function(app){
//                rObj[app]['Italy'] = (data[app])
//            })
//            //console.log('\n'+prettyjson.render(rObj));
//            getAppStoreDataByCountryTemp(interval, 'France', function(data){
//                var apps = Object.keys(data)
//                apps.map(function(app){
//                    rObj[app]['France'] = (data[app])
//                })
//                //console.log('\n'+prettyjson.render(rObj));
//                getAppStoreDataByCountryTemp(interval, 'Germany', function(data){
//                    var apps = Object.keys(data)
//                    apps.map(function(app){
//                        rObj[app]['Germany'] = (data[app])
//                    })
//                    //console.log('\n'+prettyjson.render(rObj));
//                    getAppStoreDataByCountryTemp(interval, 'UK', function(data){
//                        var apps = Object.keys(data)
//                        apps.map(function(app){
//                            rObj[app]['UK'] = (data[app])
//                        })
//                        console.log('\n'+prettyjson.render(rObj));
//                        if(callback) callback(rObj)
//                    })
//                })
//            })
//        })
//    })
//}

//getAppStoreDataByCountry('week', 'Spain')

var getAppStoreData = function(interval, callback){

    itunes.request(Report.ranked().time(1, interval+"s"), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
            result.map(function(app){
                var rObj = {}
                rObj['downloads'] = app.units
                finalRes[app.title.replace(/ /gi, '')] = rObj
            })
            itunes.request(Report.ranked().time(2, interval+'s'), function (error, result) {
                if(error) return error
                if(result){
                    result.map(function(app){
                        finalRes[app.title.replace(/ /gi, '')].previousDownloads = app.units - finalRes[app.title.replace(/ /gi, '')].downloads
                        finalRes[app.title.replace(/ /gi, '')].delta = finalRes[app.title.replace(/ /gi, '')].downloads - finalRes[app.title.replace(/ /gi, '')].previousDownloads
                        finalRes[app.title.replace(/ /gi, '')].deltaPercentage = getDeltaPercentage(finalRes[app.title.replace(/ /gi, '')].downloads, finalRes[app.title.replace(/ /gi, '')].previousDownloads )
                    })
                    var allApps = {}
                    allApps.downloads = finalRes['MyGarageSupersport'].downloads + finalRes['MyGarageMT'].downloads + finalRes['MyGarageSportHeritage'].downloads
                    allApps.previousDownloads = finalRes['MyGarageSupersport'].previousDownloads + finalRes['MyGarageMT'].previousDownloads + finalRes['MyGarageSportHeritage'].previousDownloads
                    allApps.delta = finalRes['MyGarageSupersport'].delta + finalRes['MyGarageMT'].delta + finalRes['MyGarageSportHeritage'].delta
                    allApps.deltaPercentage = getDeltaPercentage(allApps.downloads, allApps.previousDownloads)
                    finalRes['AllApps'] = allApps
                    console.log(prettyjson.render(finalRes));
                    if(callback) callback(finalRes)
                }
            });
        }
    });

}


module.exports = {
    getAppStoreData: getAppStoreData,
    getAppStoreDataByCountry: getAppStoreDataByCountry
}
//module.exports = getAppStoreDataByCountry

if(process.argv[2]){
    getAppStoreDataByCountry(process.argv[2]);
    //getAppStoreData(process.argv[2])
}