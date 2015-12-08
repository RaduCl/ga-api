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

var getAppStoreData = function(interval, callback){

    //helper method for getting deference between current and previous time interval in percents
    var getDeltaPercentage = function(currentResult, prevResult){
        return -Math.floor(100 - currentResult*100/prevResult);
    };

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
                    callback(finalRes)
                }
            });
        }
    });

}

//var getAppStoreData = function(callback){
//
//    //helper method for getting deference between current and previous time interval in percents
//    var getDeltaPercentage = function(currentResult, prevResult){
//        return -Math.floor(100 - currentResult*100/prevResult);
//    };
//
//    itunes.request(Report.ranked().time(1, 'weeks'), function (error, result) {
//        if(error) return error
//        if (result){
//            finalRes.week = result[0].units;
//            itunes.request(Report.ranked().time(2, 'weeks'), function (error, result) {
//                if(error) return error
//                if(result){
//                    finalRes.previousWeek = result[0].units - finalRes.week;
//                    finalRes.weekDelta = finalRes.week - finalRes.previousWeek;
//                    finalRes.weekDeltaPercentage = getDeltaPercentage(finalRes.week, finalRes.previousWeek);
//
//                    itunes.request(Report.ranked().time(1, 'months'), function (error, result) {
//                        if(error) return error
//                        if(result){
//                            finalRes.month = result[0].units;
//                            itunes.request(Report.ranked().time(2, 'months'), function (error, result) {
//                                if(error) return error
//                                if(result){
//                                    finalRes.previousMonth = result[0].units - finalRes.month;
//                                    finalRes.monthDelta = finalRes.month - finalRes.previousMonth;
//                                    finalRes.monthDeltaPercentage = getDeltaPercentage(finalRes.month, finalRes.previousMonth)
//                                    console.log('finalRes' + JSON.stringify(finalRes));
//                                    callback(finalRes)
//                                }
//                            });
//                        }
//                    });
//                }
//            });
//        }
//    });
//
//}

module.exports = getAppStoreData