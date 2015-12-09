var itc = require("itunesconnect");
var Report = itc.Report;
var Q = require('q');
// Connect to iTunes
var itunes = new itc.Connect('connectstats@indg.com', 'Dsc729max!');
var finalRes = {
    week : 0,
    month: 0,
    previousWeek: 0,
    previousMonth: 0,
    monthDelta: 0,
    weekDelta: 0
}

//helper method for getting deference between current and previous time interval in percents
var getDeltaPercentage = function(currentResult, prevResult){
    return -Math.floor(100 - currentResult*100/prevResult);
};

var getAppStoreDataByCountry = function(interval, callback){
    //helper method for getting deference between current and previous time interval in percents

    itunes.request(Report.ranked().time(1, interval+"s").group('location'), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
            finalRes.result1 = result.map(function(country){
                var tmp ={}
                tmp[country.title] = country.units
                console.log('tmp is: ' + JSON.stringify(tmp));
                return tmp
            });
            itunes.request(Report.ranked().time(2, interval+'s').group('location'), function (error, result) {
                if(error) return error
                if(result){

                    finalRes.result1 = result.map(function(country){
                        var tmp ={}
                        tmp[country.title] = country.units
                        console.log('tmp is: ' + JSON.stringify(tmp));
                        return tmp
                    });

                    if(callback) callback(finalRes)
                    console.log('finalRes is: ' + JSON.stringify(finalRes));
                    return finalRes
                }
            });
        }
    });
}

var getAppStoreData = function(interval, callback){

    itunes.request(Report.ranked().time(1, interval+"s"), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
            finalRes.downloads = result[0].units;
            itunes.request(Report.ranked().time(2, interval+'s'), function (error, result) {
                if(error) return error
                if(result){
                    finalRes.previousDownloads = result[0].units - finalRes.downloads;
                    finalRes.delta = finalRes.downloads - finalRes.previousDownloads;
                    finalRes.deltaPercentage = getDeltaPercentage(finalRes.downloads, finalRes.previousDownloads);
                    if(callback) callback(finalRes)
                    return finalRes
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
}