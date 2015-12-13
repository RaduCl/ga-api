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
    return Math.floor((currentResult-prevResult)/prevResult*100);
};
//helper method to format by country respone object
var formatByCountry = function(result, callback){
    var res = {}
    for(var i=0; i< result.length; i++){
        res[result[i].title] = result[i].units
    }
    callback(res)
}

var getAppStoreDataByCountry = function(interval, callback){
    //helper method for getting deference between current and previous time interval in percents

    itunes.request(Report.ranked().time(1, interval+"s").group('location'), function (error, result) {
        var finalRes = []
        var tempRes = {}
        if(error) return error
        if (result){
            formatByCountry(result,function(res){
                tempRes.res1=res
            })
            itunes.request(Report.ranked().time(2, interval+'s').group('location'), function (error, result) {
                if(error) return error
                formatByCountry(result,function(res){
                    tempRes.res2=res

                    var countries = Object.keys(tempRes.res1).slice(0,5)
                    finalRes = countries.map(function(country){
                        var countryObj={}
                        countryObj.name=country
                        countryObj.downloads = tempRes.res1[country]
                        countryObj.previousDownloads = tempRes.res2[country]-tempRes.res1[country]
                        countryObj.delta = countryObj.downloads - countryObj.previousDownloads
                        countryObj.deltaPercentage = getDeltaPercentage(countryObj.downloads, countryObj.previousDownloads)
                        return countryObj
                    })

                    //format othercountries downloads stats
                    var otherCountries = {}

                    otherCountries.name = 'Other countries'
                    otherCountries.downloads = Object.keys(tempRes.res1).slice(6).map(function(country){
                        return tempRes.res1[country]
                    }).reduce(function(prev, current){
                        return prev+current
                    },0)
                    otherCountries.previousDownloads = Object.keys(tempRes.res1).slice(6).map(function(country){
                        return tempRes.res2[country]
                    }).reduce(function(prev, current){
                        return prev+current
                    },0);
                    otherCountries.previousDownloads = otherCountries.previousDownloads - otherCountries.downloads;
                    otherCountries.delta = otherCountries.downloads - otherCountries.previousDownloads
                    otherCountries.deltaPercentage = getDeltaPercentage(otherCountries.downloads, otherCountries.previousDownloads)

                    //format total downlods stats
                    var totalDl = {}

                    totalDl.name = 'Total Downloads'
                    totalDl.downloads = Object.keys(tempRes.res1).map(function(country){
                        return tempRes.res1[country]
                    }).reduce(function(prev, current){
                        return prev+current
                    },0)
                    totalDl.previousDownloads = Object.keys(tempRes.res1).map(function(country){
                        return tempRes.res2[country]
                    }).reduce(function(prev, current){
                        return prev+current
                    },0)
                    totalDl.previousDownloads = totalDl.previousDownloads - totalDl.downloads
                    totalDl.delta = totalDl.downloads - totalDl.previousDownloads
                    totalDl.deltaPercentage = getDeltaPercentage(totalDl.downloads, totalDl.previousDownloads)
                    finalRes.push(otherCountries, totalDl);
                    if(callback) callback(finalRes)
                })
            })
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