var itc = require("itunesconnect");
var prettyjson = require('prettyjson');
var Report = itc.Report;

// Connect to iTunes
var itunes = new itc.Connect('connectstats@indg.com', 'Dsc729max!');

// Simple ranked report
var countryKeys = {
    'Italy' : 143450,
    'Spain' : 143454,
    'France' : 143442,
    'Germany' : 143443,
    'UK' : 143444
}



    var getAppStoreDataByCountry = function(country, callback)    { 
        console.log(keys);
        itunes.request(Report.ranked().time(1, 'weeks').location(country), function (error, result) {
        var finalRes = {}

        if(error) return error
        if (result){
            result.map(function(app){
                var rObj = {}
                rObj['downloads'] = app.units
                finalRes[app.title.replace(/ /gi, '')] = rObj
            })
            itunes.request(Report.ranked().time(2, 'weeks').location(country), function (error, result) {
                if(error) return error
                if(result){
                    result.map(function(app){
                        finalRes[app.title.replace(/ /gi, '')].previousDownloads = app.units - finalRes[app.title.replace(/ /gi, '')].downloads
                        finalRes[app.title.replace(/ /gi, '')].delta = finalRes[app.title.replace(/ /gi, '')].downloads - finalRes[app.title.replace(/ /gi, '')].previousDownloads
                    //    finalRes[app.title.replace(/ /gi, '')].deltaPercentage = getDeltaPercentage(finalRes[app.title.replace(/ /gi, '')].downloads, finalRes[app.title.replace(/ /gi, '')].previousDownloads )
                    })
                    console.log(prettyjson.render(finalRes));
                //    if(callback) callback(finalRes)
                }
            });
        }
    });
}